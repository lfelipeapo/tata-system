import { Box, Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function ItemBox({ item, index, handleDelete, handleUpdate }) {
  return (
    <Box
      key={index}
      sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
    >
      <Typography variant="h6">{item}</Typography>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
        style={{ marginLeft: "10px" }}
        onClick={() => handleDelete(item)}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        style={{ marginLeft: "10px" }}
        onClick={() => handleUpdate(index)}
      >
        Edit
      </Button>
    </Box>
  );
}

export default ItemBox;
