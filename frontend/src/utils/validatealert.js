import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function showValidationSuccessAlert(data, projectData, selectedProject) {
  const expiryDate = new Date(projectData.end_date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  MySwal.fire({
    icon: 'success',
    title: 'Project Validated!',
    html: (
      `<div style="text-align:left; font-size:1rem; line-height:1.7;">
        <strong>Project       :</strong> ${selectedProject.nama}<br/>
        <strong>Certificate ID:</strong> ${data.certificate?.id}<br/>
        <strong>Volume        :</strong> ${data.certificate?.amount?.toLocaleString('en-US')} tCO₂e<br/>
        <strong>Price/unit    :</strong> Rp ${data.certificate?.pricePerUnit?.toLocaleString('en-US')}<br/>
        <strong>Total Value   :</strong> Rp ${(data.certificate?.amount * data.certificate?.pricePerUnit)?.toLocaleString('en-US')}<br/>
        <strong>Expires       :</strong> ${expiryDate}<br/>
      </div>`
    ),
    showConfirmButton: true,
    confirmButtonText: 'OK',
    customClass: {
      popup: 'swal2-border-radius-xl'
    }
  });
}