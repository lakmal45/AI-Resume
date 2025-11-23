function TemplateMinimal({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="bg-white text-black p-8 shadow-xl max-w-[210mm] min-h-[297mm] mx-auto">
      {/* HEADER */}
      <div className="border-b border-gray-300 pb-3 mb-4">
        <h1 className="text-3xl font-bold">{header.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600">
          {header.role || "Your Role / Target Position"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {header.email && <span>{header.email}</span>}
          {header.email && header.phone && <span> · </span>}
          {header.phone && <span>{header.phone}</span>}
        </p>
      </div>

      {/* SUMMARY */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
          Summary
        </h2>
        <p className="text-sm mt-1 whitespace-pre-line">
          {data.summary || "Write a short, impactful summary here."}
        </p>
      </section>

      {/* SKILLS */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
          Skills
        </h2>
        <div className="mt-1 flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200"
              >
                {s}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Add skills like React, JavaScript, Node.js...
            </p>
          )}
        </div>
      </section>

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">
                {exp.role} — {exp.company}
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {(exp.bullets || []).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Projects
          </h2>
          {projects.map((p, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-sm text-gray-700">{p.desc}</p>
              {p.tech && p.tech.length > 0 && (
                <p className="text-xs text-gray-500">
                  Tech: {p.tech.join(", ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function TemplateModern({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="p-8 shadow-xl bg-white text-black max-w-[210mm] min-h-[297mm] mx-auto">
      {/* Header row */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold">{header.name || "Your Name"}</h1>
          <p className="text-sm text-gray-600">
            {header.role || "Your Role / Target Position"}
          </p>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {header.email && <p>{header.email}</p>}
          {header.phone && <p>{header.phone}</p>}
        </div>
      </div>

      {/* SUMMARY */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
          Summary
        </h2>
        <p className="text-sm mt-1 whitespace-pre-line">{data.summary}</p>
      </section>

      {/* SKILLS */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
          Skills
        </h2>
        <ul className="list-disc ml-5 text-sm">
          {skills.length
            ? skills.map((s, i) => <li key={i}>{s}</li>)
            : "Add your skills"}
        </ul>
      </section>

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">
                {exp.role} — {exp.company}
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-800">
                {(exp.bullets || []).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
            Projects
          </h2>
          {projects.map((p, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-sm text-gray-800">{p.desc}</p>
              {p.tech && p.tech.length > 0 && (
                <p className="text-xs text-gray-500">
                  Tech: {p.tech.join(", ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function TemplateTwoColumn({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="p-8 shadow-xl bg-white text-black max-w-[210mm] min-h-[297mm] mx-auto grid grid-cols-3 gap-6">
      {/* LEFT COLUMN */}
      <div className="col-span-1 border-r border-gray-300 pr-4">
        <h1 className="text-2xl font-bold">{header.name || "Your Name"}</h1>
        <p className="text-gray-600 text-sm">{header.role || "Your Role"}</p>
        <div className="mt-2 text-xs text-gray-500">
          {header.email && <p>{header.email}</p>}
          {header.phone && <p>{header.phone}</p>}
        </div>

        <h2 className="mt-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Skills
        </h2>
        <ul className="list-disc ml-5 text-xs mt-1">
          {skills.length
            ? skills.map((s, i) => <li key={i}>{s}</li>)
            : "Add your skills"}
        </ul>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-2">
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Summary
          </h2>
          <p className="text-sm mt-1 whitespace-pre-line">{data.summary}</p>
        </section>

        {experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="mt-2">
                <p className="font-semibold text-sm">
                  {exp.role} — {exp.company}
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-800">
                  {(exp.bullets || []).map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mt-2">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-sm text-gray-800">{p.desc}</p>
                {p.tech && p.tech.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Tech: {p.tech.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export { TemplateMinimal, TemplateModern, TemplateTwoColumn };
