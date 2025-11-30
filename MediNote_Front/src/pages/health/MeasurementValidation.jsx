// src/utils/measurementValidation.js

/**
 * 건강정보 등록/수정 시 입력값 유효성 검사
 * @param {Object} data - 입력 폼 데이터
 * @returns {Object} errors - 유효성 오류 메시지 모음
 */
export const MeasurementValidation = (data) => {
  const errors = {};

  // 키 (cm)
  if (data.height) {
    const height = Number(data.height);
    if (isNaN(height) || height < 100 || height > 250) {
      errors.height = "키는 100 ~ 250 cm 사이여야 합니다";
    }
  }

  // 체중 (kg)
  if (data.weight) {
    const weight = Number(data.weight);
    if (isNaN(weight) || weight < 30 || weight > 200) {
      errors.weight = "체중은 30 ~ 200 kg 사이여야 합니다";
    }
  }

  // 수축기 혈압 검증 (mmHg)
  if (data.bloodPressureSystolic) {
    const systolic = Number(data.bloodPressureSystolic);
    if (isNaN(systolic) || systolic < 60 || systolic > 250) {
      errors.bloodPressureSystolic = "수축기 혈압은 60 ~ 250 mmHg 사이여야 합니다";
    }
  }

  // 이완기 혈압 검증 (mmHg)
  if (data.bloodPressureDiastolic) {
    const diastolic = Number(data.bloodPressureDiastolic);
    if (isNaN(diastolic) || diastolic < 40 || diastolic > 150) {
      errors.bloodPressureDiastolic = "이완기 혈압은 40 ~ 150 mmHg 사이여야 합니다";
    }
  }

  // 수축기 > 이완기 혈압 검증
  if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
    const systolic = Number(data.bloodPressureSystolic);
    const diastolic = Number(data.bloodPressureDiastolic);
    if (!isNaN(systolic) && !isNaN(diastolic) && systolic <= diastolic) {
      errors.bloodPressure = "수축기 혈압이 이완기 혈압보다 높아야 합니다";
    }
  }

  // 혈당 (mg/dL)
  if (data.bloodSugar) {
    const sugar = Number(data.bloodSugar);
    if (isNaN(sugar) || sugar < 40 || sugar > 300) {
      errors.bloodSugar = "혈당은 40 ~ 300 mg/dL 사이여야 합니다";
    }
  }

  // 수면시간 (시간)
  if (data.sleepHours) {
    const sleep = Number(data.sleepHours);
    if (isNaN(sleep) || sleep < 0 || sleep > 24) {
      errors.sleepHours = "수면 시간은 0 ~ 24시간 사이여야 합니다";
    }
  }

  return errors;
};
