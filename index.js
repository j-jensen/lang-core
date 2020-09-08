const path = require("path");

const templateRe = /\${(\w+)(?:\s*)\:(?:\s*)(\w+)}/g;
const typedescRe = /(\${\w+)(:\w+)(})/g;
const templatePattern = templateRe.source;

const getPropertyTypesignature = (str) => {
  const re = new RegExp(templatePattern, "g");
  let m = re.exec(str);
  const args = [];
  if (m !== null) {
    while (m !== null) {
      args.push([m[1], m[2] || 'any']);
      m = re.exec(str);
    }
    return `(${args.map(arg => `${arg[0]}: ${arg[1]}`).join(', ')}) => string`;
  }
  return 'string';
};

const langModuleToTypescriptInterfaceProperties = (mod, indent = '  ') => Object.keys(mod)
  .map(key => `${indent}${key}: ${getPropertyTypesignature(mod[key])};`)
  .join('\n');

const filenameToInterfaceName = (filename) => path.basename(filename)
  .replace(/^(\w)/, (_, c) => 'I' + c.toUpperCase())
  .replace(/\W+(\w)/g, (_, c) => c.toUpperCase());

module.exports = {
  templateRe,
  templatePattern,
  typedescRe,
  filenameToInterfaceName,
  langModuleToTypescriptInterfaceProperties,
  getPropertyTypesignature,

  getPropertyStringifiedValue: (str, orig) => {
    const re = new RegExp(templatePattern, "g");
    let m = re.exec(orig);
    const args = [];
    if (m !== null) {
      while (m !== null) {
        args.push(m[1]);
        m = re.exec(orig);
      }
      // Outputs ES5 compliant code
      return `function(${args.map(arg => `${arg}`).join(', ')}){ return ${JSON.stringify(str.replace(typedescRe, '$1$3'))}${args.map(arg => `.replace("$\{${arg}}", ${arg})`).join('')}; }`;
      // ES6
      // return `(${args.map(arg => `${arg}`).join(', ')}) => \`${str.replace(typedescRe, '$1$3')}\``;
    }
    return JSON.stringify(str);
  },

  compileExport: (module, ref) => {
    const orig = ref || module;
    const codelines = Object.keys(module).map(key => `  ${key}: ${getPropertyStringifiedValue(module[key], orig[key])}`);
    return `module.exports = {
${codelines.join(',\n')}
};`;
  },
  filenameToTypingsFilename: (filename) => {
    const dirName = path.dirname(filename);
    const baseName = path.basename(filename);
    return path.join(dirName, `${baseName}.d.ts`);
  },
  filenameToLocalizedFilename: (filename, lang) => {
    const parsedPath = path.parse(filename);
    return path.join(parsedPath.dir, parsedPath.name + '.' + lang + parsedPath.ext);
  },
  generateGenericExportInterface: (module, filename, indent) => {
    const interfaceName = filenameToInterfaceName(filename);
    const interfaceProperties = langModuleToTypescriptInterfaceProperties(module, indent);
    return (
      `export interface ${interfaceName} {
${interfaceProperties}
}
declare const translator: ${interfaceName};
export default translator;
`);
  }
};

