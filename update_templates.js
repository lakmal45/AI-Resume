const fs = require('fs');

const file = 'c:/Users/LAKMAL/Desktop/github/AI-Resume/frontend/src/templates/Templates.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add `const education = data.education || [];`
content = content.replace(/const experience = data\.experience \|\| \[\];/g, 'const experience = data.experience || [];\n  const education = data.education || [];');
content = content.replace(/const \{ header = \{\}, skills = \[\], experience = \[\], projects = \[\] \} = data;/g, 'const { header = {}, skills = [], experience = [], education = [], projects = [] } = data;');

// 2. Add education section. Since each template is different, we can append it right before the projects section.
// The project section usually starts with `{projects.length > 0 && (` or `<section>` containing `Projects`
// We'll write a regex to find the projects block and insert the education block before it.

const eduBlock = `
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="mt-2">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-sm break-words">{edu.degree}</p>
                <p className="text-xs text-gray-500 whitespace-nowrap ml-2">{edu.year}</p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-sm text-gray-700 break-words">{edu.school}</p>
                {edu.gpa && <p className="text-xs text-gray-500 whitespace-nowrap ml-2">GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </section>
      )}
`;

// Insert eduBlock before projects section.
// We'll replace `{projects.length > 0 && (` with `\n` + eduBlock + `\n      {projects.length > 0 && (`
// And for cases where it's `<section> ... Projects`, we will try to match that.
// Let's just do it manually for safety via script string splits.

const parts = content.split('export function');
for (let i = 1; i < parts.length; i++) {
    // 1. Date ranges for experience
    // Look for `{exp.role} — {exp.company}`
    // Replace with:
    // <div className="flex justify-between items-baseline">
    //   <p className="font-semibold text-sm break-words">{exp.role} — {exp.company}</p>
    //   {(exp.startDate || exp.endDate) && (
    //     <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
    //       {exp.startDate} {exp.startDate && exp.endDate && "—"} {exp.endDate}
    //     </p>
    //   )}
    // </div>
    parts[i] = parts[i].replace(
        /<p className="font-semibold text-sm break-words">\s*\{exp\.role\} — \{exp\.company\}\s*<\/p>/g,
        `<div className="flex justify-between items-baseline">\n                <p className="font-semibold text-sm break-words">\n                  {exp.role} — {exp.company}\n                </p>\n                {(exp.startDate || exp.endDate) && (\n                  <p className="text-xs text-gray-500 whitespace-nowrap ml-2">\n                    {exp.startDate} {exp.startDate && exp.endDate && "—"} {exp.endDate}\n                  </p>\n                )}\n              </div>`
    );
    parts[i] = parts[i].replace(
        /<p className="font-semibold">\s*\{exp\.role\} — \{exp\.company\}\s*<\/p>/g,
        `<div className="flex justify-between items-baseline">\n                <p className="font-semibold">\n                  {exp.role} — {exp.company}\n                </p>\n                {(exp.startDate || exp.endDate) && (\n                  <p className="text-xs text-gray-500 whitespace-nowrap ml-2">\n                    {exp.startDate} {exp.startDate && exp.endDate && "—"} {exp.endDate}\n                  </p>\n                )}\n              </div>`
    );
    
    // 2. Education section insertion
    // Find `{projects.length > 0 && (` or `<section>` followed by `Projects`
    if (parts[i].includes('{projects.length > 0 && (')) {
        parts[i] = parts[i].replace('{projects.length > 0 && (', eduBlock + '\n      {projects.length > 0 && (');
    } else if (parts[i].includes('<section className="mb-6">\n        <h2 className="text-sm font-semibold uppercase">Projects</h2>')) {
        // Corporate template
        parts[i] = parts[i].replace('<section>\n        <h2 className="text-sm font-semibold uppercase">Projects</h2>', eduBlock + '\n      <section>\n        <h2 className="text-sm font-semibold uppercase">Projects</h2>');
    }
}

content = parts.join('export function');

// Fix the Corporate template matching
content = content.replace(
    /<section>\n\s*<h2 className="text-sm font-semibold uppercase">Projects<\/h2>/g,
    eduBlock + '\n      <section>\n        <h2 className="text-sm font-semibold uppercase">Projects</h2>'
);

fs.writeFileSync(file, content);
console.log("Done");
