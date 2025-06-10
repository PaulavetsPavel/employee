const BirthdayToast = ({ name, closeToast }) => (
  <div>
    🎉 У сотрудника <strong>{name}</strong> завтра день рождения!
    <div className="mt-2 text-end">
      <button className="btn btn-sm btn-outline-light" onClick={closeToast}>
        Закрыть
      </button>
    </div>
  </div>
);

export default BirthdayToast;
