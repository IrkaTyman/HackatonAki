import {useState} from 'react';

type Form = { [key: string]: string }
type Errors = { [key: string]: { [key: string]: boolean } }

export function useForm(fields: string[]) {
    const [form, setForm] = useState<Form>(getInitialForm())
    const [errors, setErrors] = useState<Errors | null>(null)

    function getInitialForm() {
        const form: Form = {}
        const errors: Errors = {}
        fields.forEach(field => {
            form[field] = ""

            switch (field) {
                case "password":
                    errors.password = {
                        empty: false,
                        length: false
                    };
                    break;
                case "repeatPassword":
                    errors.repeatPassword = {
                        empty: false,
                        repeat: false
                    };
                    break;
                default:
                    errors[field] = {empty: false}
            }
        })

        setErrors(errors)
        return form
    }

    function changeForm(key: string, value: string) {
        setForm({...form, [key]: value})
        checkErrors(key, value)
    }

    function checkErrors(key: string, value: string): void;
    function checkErrors(keys: string[]): void;
    function checkErrors(keys: string[] | string, value?: string) {
        if (!errors || !form) return;

        if (typeof keys == "string")
            checkError(keys, value || "");
        else
            keys.forEach(key => checkErrors(key, form[key]))

        setErrors({...errors});
    }

    function checkError(key: string, value: string) {
        if (!errors || !form) return;
        errors[key].empty = !value;
        if (key === "email" && value) errors[key].empty = errors[key].empty || !checkEmail(value);
        if (key == "repeatPassword") errors[key].repeat = value != form.password;
        if (key === "password") {
            errors.password.length = value.length < 6;
            if (errors.repeatPassword) errors.repeatPassword.repeat = value != form.repeatPassword
        }
    }

    function checkEmail(value: string) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    }

    return {form, errors, checkErrors, changeForm}
}