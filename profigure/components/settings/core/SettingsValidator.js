// Validates the enhanced settings format
export function validateSettings(settings) {
  const errors = [];
  const warnings = [];

  if (!settings?.meta?.name) {
    errors.push('Settings must include meta.name');
  }

  if (!settings?.sections || !Array.isArray(settings.sections)) {
    errors.push('Settings must include a sections array');
    return {errors, warnings, valid: false};
  }

  settings.sections.forEach((section, i) => {
    if (!section.title) {
      errors.push(`Section at index ${i} is missing title`);
    }
    if (!section.options || !Array.isArray(section.options)) {
      errors.push(`Section "${section.title}" is missing options array`);
    } else {
      section.options.forEach((option, j) => {
        if (!option.title) {
          errors.push(`Option at index ${j} in section "${section.title}" is missing title`);
        }
        if (!option.position) {
          warnings.push(`Option "${option.title}" in "${section.title}" is missing position`);
        }
        if (!option.rotation) {
          warnings.push(`Option "${option.title}" in "${section.title}" is missing rotation`);
        }
      });
    }
  });

  return {errors, warnings, valid: errors.length === 0};
}
