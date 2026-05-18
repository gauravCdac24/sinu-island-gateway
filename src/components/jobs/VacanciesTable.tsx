import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type VacancyRow = {
  vacancyNo: string;
  position: string;
  facultyDepartment: string;
  dueDate: string;
};

type VacanciesTableProps = {
  vacancies: VacancyRow[];
  showApply?: boolean;
};

const VacanciesTable = ({ vacancies, showApply = true }: VacanciesTableProps) => {
  if (vacancies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#22a2bf]/40 bg-[#edf4ff]/50 px-6 py-12 text-center">
        <p className="text-[#082952] font-medium">No positions listed at this time.</p>
        <p className="text-muted-foreground text-sm mt-2">
          Please check back later or visit the HR Department at Kukum Campus.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="bg-[#082952] text-white">
            <th className="px-5 py-4 font-semibold first:rounded-tl-xl">Vacancy No.</th>
            <th className="px-5 py-4 font-semibold">Position</th>
            <th className="px-5 py-4 font-semibold">Faculty/Department</th>
            <th className="px-5 py-4 font-semibold">Due Date</th>
            <th className="px-5 py-4 font-semibold text-center last:rounded-tr-xl">
              {showApply ? "Apply" : "View"}
            </th>
          </tr>
        </thead>
        <tbody>
          {vacancies.map((v, i) => (
            <tr
              key={v.vacancyNo}
              className={`transition-colors hover:bg-[#edf4ff]/60 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50/80"
              }`}
            >
              <td className="px-5 py-4 font-semibold text-[#082952]">{v.vacancyNo}</td>
              <td className="px-5 py-4 text-gray-800 font-medium">{v.position}</td>
              <td className="px-5 py-4 text-gray-600">{v.facultyDepartment}</td>
              <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{v.dueDate}</td>
              {showApply ? (
                <td className="px-5 py-4 text-center">
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#ffb703] hover:bg-[#082952] text-[#082952] hover:text-white font-semibold shadow-sm"
                  >
                    <Link
                      to={`/jobs-vacancies/apply?vacancy=${encodeURIComponent(v.vacancyNo)}`}
                    >
                      Apply Now
                    </Link>
                  </Button>
                </td>
              ) : (
                <td className="px-5 py-4 text-center">
                  <Link
                    to={`/jobs-vacancies/archived?view=${encodeURIComponent(v.vacancyNo)}`}
                    className="text-sm font-medium text-[#22a2bf] hover:underline"
                  >
                    View
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VacanciesTable;
