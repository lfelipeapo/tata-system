import Swal from "sweetalert2";

const swalAlert = async (icon, title, text) => {
  await Swal.fire(title, text, icon);
};

export default swalAlert;