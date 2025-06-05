import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ page, setPage, dataLenght }) => {
  return (
    <>
      <Pagination>
        <Pagination.Prev onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
          <i className="bi bi-chevron-left"></i> Назад
        </Pagination.Prev>
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next onClick={() => setPage((prev) => prev + 1)} disabled={dataLenght < 10}>
          Вперед <i className="bi bi-chevron-right"></i>
        </Pagination.Next>
      </Pagination>
    </>
  );
};

export default PaginationComponent;
