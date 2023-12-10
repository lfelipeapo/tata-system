import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const SubmitButtonComponent = ({ isLoading, text, fullWidth }) => (
  <Button
    type="submit"
    variant="contained"
    color="secondary"
    fullWidth={fullWidth || true}
    disabled={isLoading}
    sx={{ mt: 3, mb: 2 }}
  >
    {isLoading ? <CircularProgress size={24} /> : text}
  </Button>
);

export default SubmitButtonComponent;