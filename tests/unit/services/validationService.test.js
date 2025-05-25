const { validateURL } = require('../../../backend/services/validationService');

describe('Validation Service', () => {
  test('should validate correct URLs', () => {
    expect(() => validateURL('https://example.com/image.jpg')).not.toThrow();
  });
});