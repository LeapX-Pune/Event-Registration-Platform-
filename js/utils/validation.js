const Validator = {
  required(value, fieldName) {
    if (!value || !value.trim()) return `${fieldName} is required.`;
    return "";
  },

  date(value) {
    if (!value) return "Date is required.";
    if (isNaN(new Date(value).getTime())) return "Invalid date.";
    return "";
  },

  min(value, min, fieldName) {
    if (Number(value) < min) return `${fieldName} cannot be less than ${min}.`;
    return "";
  },

  validateEvent(data) {
    const errors = {};
    const titleErr = this.required(data.title, "Title");
    if (titleErr) errors.title = titleErr;

    const dateErr = this.date(data.date);
    if (dateErr) errors.date = dateErr;

    const attendeesErr = this.min(data.maxAttendees, 1, "Max attendees");
    if (attendeesErr) errors.maxAttendees = attendeesErr;

    return errors;
  }
};
