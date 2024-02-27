import { AbstractControl, ValidationErrors } from "@angular/forms";

export class notNull {
    static notNullValidation(control: AbstractControl): ValidationErrors | null{
        let controlValue = control.value as string;
        if(controlValue.replace(/\s/g, '') === '')
        {
            return {notNullValidator: true};
        }
        else{
            return null;
        }
    }
}