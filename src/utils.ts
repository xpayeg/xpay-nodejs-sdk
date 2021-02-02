import parsePhoneNumber from "libphonenumber-js/max";

export namespace Utils {
  export function validateName(name: string) {
    const regExp = new RegExp(
      /^[a-zA-Z\u0621-\u064A-]{3,}(?:\s[a-zA-Z\u0621-\u064A-]{3,})+$/
    );
    return regExp.test(name);
  }

  export function validateEmail(email: string) {
    const regExp = new RegExp(/^[a-z0-9._%+-]+@[a-z.-]+[.][a-z]{2,4}$/);
    return regExp.test(email);
  }

  export function validatePhone(phone: string) {
    return parsePhoneNumber(phone)?.isValid() ? true : false;
  }
}
