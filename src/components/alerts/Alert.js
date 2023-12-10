import Swal from "sweetalert2";

const swalAlert = async (icon, title, text) => {
  await Swal.fire({title: title, text: text, icon: icon});
};

export default swalAlert;