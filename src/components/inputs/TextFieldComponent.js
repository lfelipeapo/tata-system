import TextField from "@mui/material/TextField";

const TextFieldComponent = ({ variant, margin, required, autoFocus, label, type, value, onChange, fullWidth, color }) => (
  <TextField
    variant={variant || "outlined"}
    margin={margin || "normal"}
    required={required || true}
    autoFocus={autoFocus || true}
    label={label}
    type={type || "text"}
    value={value}
    onChange={onChange}
    fullWidth={fullWidth || true}
    color={color || "secondary"}
  />
);

export default TextFieldComponent;
