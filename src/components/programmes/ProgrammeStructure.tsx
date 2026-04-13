import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // You can use any icon library or CSS
import { getApiUrl } from "@/lib/apiBase";

interface Unit {
    _id: string;
    programme_units: string;
    unit_title: string;
    unit_prerequisite: string;
    unit_study_type: string;
    unit_description: string;
    unit_study_period: string;
    unit_credits: string;
}

const ProgrammeStructure = () => {
    const { state } = useLocation();
    const { programme_units } = state || {};

    const [programmes, setProgrammes] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    /* ---------------- TOGGLE UNIT EXPANSION ---------------- */
    const toggleUnitExpansion = (unitId: string) => {
        const newExpanded = new Set(expandedUnits);
        if (newExpanded.has(unitId)) {
            newExpanded.delete(unitId);
        } else {
            newExpanded.add(unitId);
        }
        setExpandedUnits(newExpanded);
    };

    /* ---------------- FETCH PROGRAMMES ---------------- */
    const fetchProgrammes = async () => {
        try {
            setLoading(true);
            let processedUnits = [];

            if (programme_units && programme_units.length !== 0) {
                processedUnits = programme_units
                    .split("\n")
                    .map((v) => v.trim())
                    .filter((v) => v.length > 0);
            }

            // If you need to fetch each unit separately and combine results
            if (processedUnits.length > 0) {
                const allResults: Unit[] = [];

                // Fetch data for each programme unit
                for (const unit of processedUnits) {
                    const params = new URLSearchParams();
                    params.append("programme_units", unit);
                    const res = await fetch(
                        getApiUrl(`/unit_catalogues/code?${params.toString()}`)
                    );

                    if (res.ok) {
                        const json = await res.json();
                        console.log("Fetching unit:", json);
                        
                        // Handle different response structures
                        let dataToProcess: Unit[] = [];
                        
                        if (Array.isArray(json)) {
                            // If the response is directly an array
                            dataToProcess = json;
                        } else if (json && json.data && Array.isArray(json.data)) {
                            // If the response has a data property containing an array
                            dataToProcess = json.data;
                        } else if (json) {
                            // If the response is a single object, wrap it in an array
                            dataToProcess = [json];
                        }
                        
                        if (dataToProcess.length > 0) {
                            allResults.push(...dataToProcess);
                            console.log("Fetched unit data:", dataToProcess);
                        }
                    } else {
                        console.error("Failed to fetch unit:", unit, res.statusText);

                        if (res.status === 404) {
                            console.warn("Unit not found:", unit);
                            // Continue with other units instead of returning
                            continue;
                        }
                    }
                }
                setProgrammes(allResults);
                
                // Expand first unit by default
                if (allResults.length > 0 && allResults[0]._id) {
                    setExpandedUnits(new Set([allResults[0]._id]));
                }
            } else {
                setProgrammes([]);
            }

        } catch (err) {
            console.error("Failed to fetch programmes", err);
            setProgrammes([]);
        } finally {
            setLoading(false);
        }
    };
    
    /* ---------------- INITIAL LOAD ---------------- */
    useEffect(() => {
        fetchProgrammes();
    }, []);

    return (
        <Card className="w-full md:mb-20 shadow-lg border border-gray-200 bg-black/10 duration-300 ease-in-out hover:scale-102">
            <CardContent>
                <section className="w-full" aria-label="Programme structure">
                    <div className="max-w-5xl mx-auto px-4 py-8">
                        <h2 className="text-3xl md:text-2xl font-bold text-[#222222] mb-6">
                            Program Structure
                        </h2>
                        
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Loading programme structure...</p>
                            </div>
                        ) : programmes.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No programme units found.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl md:text-xl text-blue-600/60">
                                        {programmes.length} Units Found
                                    </h2>
                                    
                                    {/* Expand/Collapse All buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const allIds = programmes.map(unit => unit._id).filter(Boolean);
                                                setExpandedUnits(new Set(allIds));
                                            }}
                                            className="text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                        >
                                            Expand All
                                        </button>
                                        <button
                                            onClick={() => setExpandedUnits(new Set())}
                                            className="text-sm px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            Collapse All
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Total credits */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-lg font-semibold text-[#082952]">
                                        Total Credits: {
                                            programmes.reduce((total, unit) => {
                                                const credits = parseInt(unit.unit_credits) || 0;
                                                return total + credits;
                                            }, 0)
                                        }
                                    </p>
                                </div>
                                
                                {/* Units list */}
                                <div className="space-y-3">
                                    {programmes.map((unit, index) => {
                                        const isExpanded = expandedUnits.has(unit._id || `unit-${index}`);
                                        const unitId = unit._id || `unit-${index}`;
                                        
                                        return (
                                            <div 
                                                key={unitId}
                                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => toggleUnitExpansion(unitId)}
                                            >
                                                {/* Minimized/Collapsed View */}
                                                <div className={`p-4 ${isExpanded ? 'bg-blue-50 border-b border-gray-200' : 'bg-white hover:bg-gray-50'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <span className="text-sm font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                                                    {index + 1}
                                                                </span>
                                                                <h3 className="text-lg font-semibold text-blue-600">
                                                                    {unit.programme_units || `Unit ${index + 1}`}
                                                                </h3>
                                                            </div>
                                                            <p className="text-base font-medium text-gray-800">
                                                                {unit.unit_title}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4">
                                                            {/* Credits badge */}
                                                            <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                                                {unit.unit_credits || "0"} Credits
                                                            </span>
                                                            
                                                            
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Arrow indicator at bottom - only show when collapsed */}
                                                    {!isExpanded && (
                                                        <div className="flex justify-center mt-2 pt-2 border-t border-gray-100">
                                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Expanded/Detailed View */}
                                                {isExpanded && (
                                                    <div className="p-4 bg-white animate-in fade-in duration-200">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500 mb-1">Study Period</p>
                                                                    <p className="text-base text-gray-800">
                                                                        {unit.unit_study_period || "N/A"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500 mb-1">Study Type</p>
                                                                    <p className="text-base text-gray-800">
                                                                        {unit.unit_study_type || "N/A"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500 mb-1">Credits</p>
                                                                    <p className="text-base font-semibold text-gray-800">
                                                                        {unit.unit_credits || "N/A"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500 mb-1">Prerequisite</p>
                                                                    <p className="text-base text-gray-800">
                                                                        {unit.unit_prerequisite || "None"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Unit Description */}
                                                        {unit.unit_description && (
                                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                                                                <p className="text-gray-700 leading-relaxed">
                                                                    {unit.unit_description}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Close indicator */}
                                                        <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <ChevronUp className="w-4 h-4" />
                                                                <span>Click to collapse</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <p className="text-[#082952] mb-4 mt-8">
                                    Our programmes are designed to provide students with a comprehensive education that combines theoretical knowledge with practical skills. Each programme is carefully crafted to meet industry standards and prepare students for successful careers in their chosen fields.
                                </p>
                            </>
                        )}
                    </div>
                </section>
            </CardContent>
        </Card>
    );
}

export default ProgrammeStructure;