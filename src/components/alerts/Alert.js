import Swal from "sweetalert2";

const swalAlert = async (title, text, icon) => {
  await Swal.fire({
    title: title,
    text: text,
    icon: icon
  });
};

export default swalAlert;