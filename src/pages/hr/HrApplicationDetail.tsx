import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { hrFetch } from "@/lib/hrApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HrApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = (await hrFetch(`/hr/applications/${id}`)) as {
          application: Record<string, unknown>;
        };
        setApp(data.application);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!app) return <p>Application not found.</p>;

  const formData = app.formData as Record<string, unknown> | undefined;
  const documents = app.documents as { category: string; originalName: string }[] | undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/hr/applications" className="text-sm text-[#22a2bf] hover:underline">
        ← Applications
      </Link>
      <h1 className="text-2xl font-bold text-[#082952]">{String(app.fullName)}</h1>
      <p className="text-muted-foreground">
        {String(app.positionTitle)} · {String(app.vacancyNo)}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>Email: {String(app.email)}</p>
          {formData?.contact != null && (
            <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto max-h-48">
              {JSON.stringify(formData.contact, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {documents && documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm">
              {documents.map((d, i) => (
                <li key={i}>
                  {d.category}: {d.originalName}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Full application data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-[480px]">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default HrApplicationDetail;
