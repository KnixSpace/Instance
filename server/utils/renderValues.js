const mustache = require("mustache");
// const renderWithFallback = (template, context) => {
//   const renderedValue = mustache.render(template.value, context);
//   return renderedValue !== "" ? renderedValue : template.value;
// };

function renderWithFallback (template, context) {
    const getValueFromContext = (path, obj) => {
      return path
        .split(".") // Split the dot-separated path
        .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
    };
  
    let renderedValue;
  
    if (Array.isArray(getValueFromContext(template.value, context))) {
      // Handle array case
      const arrayValue = getValueFromContext(template.value, context);
      renderedValue = arrayValue
        .map(item => mustache.render(template.value, { ...context, ...item }))
        .join(", "); // Join rendered values with a separator (e.g., comma)
    } else {
      // Handle non-array case
      const value = getValueFromContext(template.value, context);
      renderedValue = mustache.render(
        template.value,
        { ...context, [template.value]: value } // Dynamically inject resolved value
      );
    }
  
    // Return rendered value or fallback to the original template
    return renderedValue !== "" ? renderedValue : template.value;
  };

  module.exports = { renderWithFallback };