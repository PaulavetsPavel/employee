import { Spinner } from 'react-bootstrap';

const SpinnerComponent = () => {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3">Загрузка данных...</p>
    </div>
  );
};

export default SpinnerComponent;
