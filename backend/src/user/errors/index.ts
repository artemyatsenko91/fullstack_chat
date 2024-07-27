import Handlebars from "handlebars";

const exist_field_template = "User with this {{field}} already exists";
export const login_error = "Wrong userName or password";

export const exist_field = Handlebars.compile(exist_field_template);
