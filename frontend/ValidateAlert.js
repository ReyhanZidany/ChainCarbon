import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function showValidationSuccessAlert(data, projectData, selectedProject) {
  const expiryDate = new Date(projectData.end_date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  MySwal.fire({
    icon: 'success',
    title: 'Project Validated!',
    html: (
      <div style={{ textAlign: 'left', fontSize: '1rem', lineHeight: 1.7 }}>
        <strong>Project:</strong> {selectedProject.nama}<br/>
        <strong>Certificate ID:</strong> {data.certificate?.id}<br/>
        <strong>Volume:</strong> {data.certificate?.amount?.toLocaleString('en-US')} tCO₂e<br/>
        <strong>Price/unit:</strong> Rp {data.certificate?.pricePerUnit?.toLocaleString('en-US')}<br/>
        <strong>Total Value:</strong> Rp {(data.certificate?.amount * data.certificate?.pricePerUnit)?.toLocaleString('en-US')}<br/>
        <strong>Expires:</strong> {expiryDate}<br/>
        <hr />
        <span style={{color: '#065f46'}}>Certificate issued on blockchain. Data is permanent and cannot be revoked.</span>
      </div>
    ),
    showConfirmButton: true,
    confirmButtonText: 'OK',
    customClass: {
      popup: 'swal2-border-radius-xl'
    }
  });
}