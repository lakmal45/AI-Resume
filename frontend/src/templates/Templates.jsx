import React from "react";

export function TemplateMinimal({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    // ⭐ UPDATED – remove inner A4 + shadow, let Editor handle; add w-full h-full
    <div className="w-full h-full text-black p-8">
      <div className="border-b border-gray-300 pb-3 mb-4">
        <h1 className="text-3xl font-bold break-words">
          {/* ⭐ UPDATED – break long names */}
          {header.name || "Your Name"}
        </h1>
        <p className="text-sm text-gray-600 break-words">
          {header.role || "Your Role / Target Position"}
        </p>
        <p className="text-xs text-gray-500 mt-1 break-words">
          {header.email && <span>{header.email}</span>}
          {header.email && header.phone && <span> · </span>}
          {header.phone && <span>{header.phone}</span>}
        </p>
      </div>

      <section className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
          Summary
        </h2>
        {/* ⭐ UPDATED – wrap long words & keep line breaks */}
        <p className="text-sm mt-1 whitespace-pre-wrap break-words">
          {data.summary || "Write a short, impactful summary here."}
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
          Skills
        </h2>
        <div className="mt-1 flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((s, i) => (
              <span
                key={i}
                // ⭐ UPDATED – force long single skill words to wrap inside pill
                className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200 max-w-full break-words"
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

      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm break-words">
                {exp.role} — {exp.company}
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {(exp.bullets || []).map((b, j) => (
                  <li key={j} className="break-words">
                    {/* ⭐ UPDATED – wrap long bullet text */}
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Projects
          </h2>
          {projects.map((p, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm break-words">{p.name}</p>
              <p className="text-sm text-gray-700 break-words">{p.desc}</p>
              {p.tech && p.tech.length > 0 && (
                <p className="text-xs text-gray-500 break-words">
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

export function TemplateModern({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    // ⭐ UPDATED – no inner A4 + shadow
    <div className="w-full h-full text-black p-8">
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold break-words">
            {header.name || "Your Name"}
          </h1>
          <p className="text-sm text-gray-600 break-words">
            {header.role || "Your Role / Target Position"}
          </p>
        </div>
        <div className="text-xs text-gray-500 text-right break-words">
          {header.email && <p>{header.email}</p>}
          {header.phone && <p>{header.phone}</p>}
        </div>
      </div>

      <section className="mb-4">
        <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
          Summary
        </h2>
        {/* ⭐ UPDATED – wrap long words */}
        <p className="text-sm mt-1 whitespace-pre-wrap break-words">
          {data.summary || "Write a short, impactful summary here."}
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
          Skills
        </h2>
        <ul className="list-disc ml-5 text-sm">
          {skills.length
            ? skills.map((s, i) => (
                <li key={i} className="break-words">
                  {/* ⭐ UPDATED */}
                  {s}
                </li>
              ))
            : "Add skills like React, JavaScript, Node.js..."}
        </ul>
      </section>

      {experience.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm break-words">
                {exp.role} — {exp.company}
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-800">
                {(exp.bullets || []).map((b, j) => (
                  <li key={j} className="break-words">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
            Projects
          </h2>
          {projects.map((p, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm break-words">{p.name}</p>
              <p className="text-sm text-gray-800 break-words">{p.desc}</p>
              {p.tech && p.tech.length > 0 && (
                <p className="text-xs text-gray-500 break-words">
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

export function TemplateTwoColumn({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    // ⭐ UPDATED – no inner A4 + shadow
    <div className="w-full h-full text-black p-8 grid grid-cols-3 gap-6 min-h-screen">
      <div className="col-span-1 border-r border-gray-300 pr-4 min-h-screen">
        <h1 className="text-2xl font-bold break-words">
          {header.name || "Your Name"}
        </h1>
        <p className="text-gray-600 text-sm break-words">
          {header.role || "Your Role"}
        </p>
        <div className="mt-2 text-xs text-gray-500 break-words">
          {header.email && <p>{header.email}</p>}
          {header.phone && <p>{header.phone}</p>}
        </div>

        <h2 className="mt-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Skills
        </h2>
        <ul className="list-disc ml-5 text-xs mt-1">
          {skills.length
            ? skills.map((s, i) => (
                <li key={i} className="break-words">
                  {s}
                </li>
              ))
            : "Add skills like React, JavaScript, Node.js..."}
        </ul>
      </div>

      <div className="col-span-2">
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Summary
          </h2>
          {/* ⭐ UPDATED – wrap long words */}
          <p className="text-sm mt-1 whitespace-pre-wrap break-words">
            {data.summary || "Write a short, impactful summary here."}
          </p>
        </section>

        {experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="mt-2">
                <p className="font-semibold text-sm break-words">
                  {exp.role} — {exp.company}
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-800">
                  {(exp.bullets || []).map((b, j) => (
                    <li key={j} className="break-words">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mt-2">
                <p className="font-semibold text-sm break-words">{p.name}</p>
                <p className="text-sm text-gray-800 break-words">{p.desc}</p>
                {p.tech && p.tech.length > 0 && (
                  <p className="text-xs text-gray-500 break-words">
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
