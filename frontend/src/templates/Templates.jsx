import React from "react";

// A two-column layout template
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

// A two-column layout template
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

// A two-column layout template
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

// A clean, professional-style template
export function TemplateCorporate({ data }) {
  const { header = {}, skills = [], experience = [], projects = [] } = data;

  return (
    <div className="w-full h-full p-10 text-gray-900 font-sans">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-4xl font-bold tracking-tight">
          {header.name || "Your Name"}
        </h1>
        <p className="text-md text-gray-600">{header.role || "Job Title"}</p>
        <p className="text-xs text-gray-500 mt-1">
          {header.email} {header.phone && " • " + header.phone}
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-sm font-semibold uppercase text-gray-700">
          Professional Summary
        </h2>
        <p className="text-sm mt-2 whitespace-pre-wrap">{data.summary}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold uppercase">Core Skills</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((s, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-gray-100 border rounded"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold uppercase">Experience</h2>
        {experience.map((e, i) => (
          <div key={i} className="mt-3">
            <p className="font-semibold">
              {e.role} — {e.company}
            </p>
            <ul className="list-disc ml-5 text-sm">
              {e.bullets?.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase">Projects</h2>
        {projects.map((p, i) => (
          <div key={i} className="mt-3">
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-gray-700">{p.desc}</p>
            <p className="text-xs text-gray-500">Tech: {p.tech?.join(", ")}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

// A technical, detailed-style template
export function TemplateTechMatrix({ data }) {
  const { header = {}, skills = [], experience = [], projects = [] } = data;
  return (
    <div className="w-full h-full p-8 font-sans">
      <div className="grid grid-cols-2 gap-4 items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">{header.name}</h1>
          <p className="text-sm text-gray-600">{header.role}</p>
        </div>
        <div className="text-xs text-right text-gray-500">
          <p>{header.email}</p>
          <p>{header.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <section>
          <h2 className="font-semibold text-gray-700 text-xs uppercase">
            Skills
          </h2>
          <ul className="text-xs list-disc ml-5 mt-2">
            {skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-700 text-xs uppercase">
            Summary
          </h2>
          <p className="text-sm mt-2 whitespace-pre-wrap">{data.summary}</p>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="font-semibold uppercase text-xs">Experience</h2>
        {experience.map((e, i) => (
          <div key={i} className="mt-3">
            <p className="font-semibold">
              {e.role} — {e.company}
            </p>
            <ul className="list-disc ml-5 text-sm">
              {e.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-6">
        <h2 className="font-semibold uppercase text-xs">Projects</h2>
        {projects.map((p, i) => (
          <div key={i} className="mt-3">
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm">{p.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

// A compact, information-dense template
export function TemplateCompact({ data }) {
  const { header = {}, skills = [], experience = [], projects = [] } = data;

  return (
    <div className="w-full h-full p-6 text-[13px] leading-tight">
      <h1 className="text-2xl font-bold">{header.name}</h1>
      <p>{header.role}</p>
      <p className="text-xs text-gray-500">
        {header.email} • {header.phone}
      </p>

      <p className="mt-3 whitespace-pre-wrap">{data.summary}</p>

      <h2 className="mt-4 font-semibold text-sm uppercase">Skills</h2>
      <p>{skills.join(" | ")}</p>

      <h2 className="mt-4 font-semibold text-sm uppercase">Experience</h2>
      {experience.map((e, i) => (
        <div key={i} className="mt-2">
          <p className="font-semibold">
            {e.role} — {e.company}
          </p>
          <ul className="list-disc ml-5">
            {e.bullets?.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2 className="mt-4 font-semibold text-sm uppercase">Projects</h2>
      {projects.map((p, i) => (
        <div key={i} className="mt-2">
          <p className="font-semibold">{p.name}</p>
          <p>{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

// 1. A Bold, Dark-Header Template for Corporate/Management roles
export function TemplateProfessional({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Dark Header Block */}
      <div className="bg-slate-800 text-white p-8">
        <h1 className="text-4xl font-bold uppercase tracking-wider break-words">
          {header.name || "Your Name"}
        </h1>
        <p className="text-lg text-slate-300 mt-1 break-words">
          {header.role || "Your Role"}
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-4 break-words">
          {header.email && <span>{header.email}</span>}
          {header.phone && <span>{header.phone}</span>}
        </div>
      </div>

      <div className="p-8 text-black flex-grow">
        <section className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">
            Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
            {data.summary || "Write a short, impactful summary here."}
          </p>
        </section>

        <section className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {skills.length > 0 ? (
              skills.map((s, i) => (
                <span
                  key={i}
                  className="text-sm font-semibold text-gray-700 break-words"
                >
                  • {s}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">Add relevant skills...</p>
            )}
          </div>
        </section>

        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-5 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h3 className="font-bold text-md text-gray-900 break-words">
                    {exp.role}
                  </h3>
                  <span className="text-sm text-gray-500 font-medium break-words">
                    {exp.company}
                  </span>
                </div>
                <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
                  {(exp.bullets || []).map((b, j) => (
                    <li key={j} className="break-words pl-1 mb-1">
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
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-bold text-sm text-gray-900 break-words">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 break-words">
                  {p.desc}
                </p>
                {p.tech && p.tech.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1 italic break-words">
                    Stack: {p.tech.join(", ")}
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

// 2. A Serif-based, Centered Template for Academic/Legal/Luxury
export function TemplateElegant({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="w-full h-full text-black p-10 font-serif">
      <div className="text-center border-b-2 border-black pb-6 mb-6">
        <h1 className="text-4xl font-normal break-words tracking-tight">
          {header.name || "Your Name"}
        </h1>
        <p className="text-md italic text-gray-600 mt-2 break-words">
          {header.role || "Your Role"}
        </p>
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest break-words">
          {header.email} {header.phone && `| ${header.phone}`}
        </p>
      </div>

      <section className="mb-6 text-center">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words max-w-2xl mx-auto">
          {data.summary || "Write a short, impactful summary here."}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8">
        {experience.length > 0 && (
          <section>
            <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-6">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-lg break-words">
                    {exp.company}
                  </h3>
                  <p className="text-sm italic text-gray-600 break-words">
                    {exp.role}
                  </p>
                </div>
                <ul className="text-sm text-gray-700 text-justify">
                  {(exp.bullets || []).map((b, j) => (
                    <li key={j} className="mb-1 break-words">
                      • {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
              Key Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <div key={i} className="p-2">
                  <p className="font-bold text-sm break-words border-b border-gray-200 inline-block mb-1">
                    {p.name}
                  </p>
                  <p className="text-sm text-gray-700 break-words">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
            Expertise
          </h2>
          <div className="flex justify-center flex-wrap gap-3">
            {skills.map((s, i) => (
              <span
                key={i}
                className="text-sm border-b border-gray-400 break-words"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// 3. A Sidebar-Color Template for Creatives (High Contrast)
export function TemplateCreative({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="w-full h-full grid grid-cols-12 min-h-screen">
      {/* Sidebar - Solid Color (3 cols) */}
      <div className="col-span-4 bg-gray-900 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase leading-tight break-words text-yellow-500">
            {header.name || "Name"}
          </h1>
          <p className="text-sm font-medium text-gray-300 mt-2 break-words">
            {header.role || "Role"}
          </p>
        </div>

        <div className="mb-8 text-xs text-gray-400 space-y-1 break-words">
          {header.email && <div className="break-all">{header.email}</div>}
          {header.phone && <div>{header.phone}</div>}
        </div>

        <section>
          <h2 className="text-xs font-bold uppercase text-yellow-500 tracking-widest mb-4 border-b border-gray-700 pb-1">
            Skills
          </h2>
          <div className="flex flex-col gap-2">
            {skills.length > 0 ? (
              skills.map((s, i) => (
                <span key={i} className="text-sm font-light break-words">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">React, Node...</span>
            )}
          </div>
        </section>
      </div>

      {/* Main Content (9 cols) */}
      <div className="col-span-8 bg-white p-8 text-black">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-yellow-500 pl-3 mb-3 uppercase">
            Profile
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
            {data.summary || "Write a short, impactful summary here."}
          </p>
        </section>

        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-yellow-500 pl-3 mb-4 uppercase">
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-6">
                <div className="flex flex-col mb-1">
                  <h3 className="font-bold text-md text-gray-800 break-words">
                    {exp.role}
                  </h3>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide break-words">
                    {exp.company}
                  </span>
                </div>
                <ul className="list-disc ml-4 text-sm text-gray-600">
                  {(exp.bullets || []).map((b, j) => (
                    <li key={j} className="mb-1 break-words">
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
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-yellow-500 pl-3 mb-4 uppercase">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-4 bg-gray-50 p-3 rounded">
                <p className="font-bold text-sm text-gray-800 break-words">
                  {p.name}
                </p>
                <p className="text-sm text-gray-600 break-words mt-1">
                  {p.desc}
                </p>
                {p.tech && p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tech.map((t, k) => (
                      <span
                        key={k}
                        className="text-[10px] uppercase bg-white border border-gray-200 px-1 py-0.5 rounded text-gray-500"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
