/**
 * setForm을 받아서
 * (field, value) => {...} 형태의 updater를 만들어주는 헬퍼
 */
export const createUpdateField = (setForm) => {
  return (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
};
