import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/manage-employee.service';
import { NgToastService } from 'ng-angular-popup';
import { notNull } from '../../validators/notNull.validator';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './employee-add-edit.component.html',
  styleUrls: ['./employee-add-edit.component.scss'],
})
export class EmployeeAddEditComponent implements OnInit {
  // Define form group and other properties
  employeeForm!: FormGroup;
  isAddMode: boolean = true;
  employeeId!: string;
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  indPhoneNumberRegex: RegExp = /^[56789]\d{9}$/;
  errorFlag: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toast: NgToastService
  ) {}

  // Helper function to create a FormGroup for a skill
  private createSkillFormGroup() {
    return this.formBuilder.group({
      skillName: ['', [Validators.required, notNull.notNullValidation]],
      experience: [' ', [Validators.required, notNull.notNullValidation]],
    });
  }

  // Initialize component
  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];
    this.isAddMode = this.employeeId ? false : true;

    // Create the employee form with validation rules
    this.employeeForm = this.formBuilder.group({
      id: [
        { value: '', disabled: !this.isAddMode },
        [Validators.required, notNull.notNullValidation],
      ],
      name: ['', [Validators.required, notNull.notNullValidation]],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(this.indPhoneNumberRegex)],
      ],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      gender: ['', Validators.required],
      skills: this.formBuilder.array([this.createSkillFormGroup()]),
    });

    // If editing, populate the form with existing employee data
    if (!this.isAddMode) {
      const employee = this.employeeService.getEmployeeById(this.employeeId);

      if (employee) {
        // Patch values for top-level controls
        this.employeeForm.patchValue({
          id: employee.id,
          name: employee.name,
          contactNumber: employee.contactNumber,
          email: employee.email,
          gender: employee.gender,
        });

        // Patch values for skills FormArray
        const skillsFormArray = this.employeeForm.get('skills') as FormArray;
        skillsFormArray.clear(); // Clear existing skills

        // Add new skills based on employee data
        for (const skill of employee.skills) {
          skillsFormArray.push(
            this.formBuilder.group({
              skillName: skill.skillName,
              experience: skill.experience,
            })
          );
        }
      } else {
        console.log('Employee not found!');
      }
    }
  }

  // Getter for skills FormArray
  get skills() {
    return this.employeeForm.get('skills') as FormArray;
  }

  // Method to add a new skill
  addSkill() {
    this.skills.push(this.createSkillFormGroup());
  }

  // Method to delete a skill at a given index
  deleteSkill(index: number) {
    this.skills.removeAt(index);
  }

  // Helper function to convert string to title case
  toTitleCase(string: string) {
    return string.replace(/\w\S*/g, 
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // Method to show error toast with specific field name
  showErrorToast(errorField: string) {
    let title;
    let message = `${this.toTitleCase(errorField)} can't be empty`;

    if (errorField === 'contactNumber') {
      errorField = 'Contact Number';
      message = `${this.toTitleCase(errorField)} is incorrect or empty`;
    } else if (errorField === 'email') {
      message = `${this.toTitleCase(errorField)} is incorrect or empty`;
    }

    title = `${this.toTitleCase(errorField)} is not valid`;

    this.toast.error({
      detail: title,
      summary: message,
      duration: 2000,
    });
  }

  // Method to show success toast with employee name and action
  showSuccessToast(employeeName: string, successField: string) {
    let message = `The Employee ${employeeName} is ${successField} successfully.`;
    this.toast.success({
      detail: message,
      duration: 2000,
    });
  }

  // Method called on form submission
  onSubmit() {
    // Check for any validation errors
    if (this.employeeForm.invalid) {
      /// Log errors for each form control if needed
      const formControls = Object.keys(this.employeeForm.controls);
      for (let i = 0; i < formControls.length; i++) {
        const key = formControls[i];
        const controlErrors = this.employeeForm.get(key)?.errors;
        if (controlErrors != null) {
          this.errorFlag = true;
          this.showErrorToast(key);
          break; // Exit the loop
        } else {
          this.errorFlag = false;
        }
      }

      if (!this.errorFlag) {
        // Log errors for each form control inside the skills array
        const skillsFormArray = this.employeeForm.get('skills') as FormArray;
        skillsFormArray.controls.forEach((skillGroup, index) => {
          // Check if skillGroup is FormGroup
          if (skillGroup instanceof FormGroup) {
            // Log errors for each form control inside the skill FormGroup
            for (const skillKey of Object.keys(skillGroup.controls)) {
              const skillControlErrors = skillGroup.get(skillKey)?.errors;
              if (skillControlErrors != null) {
                this.showErrorToast(skillKey);
                break; // Exit the for loop
              }
            }
          }
        });
      }
      return;
    }

    const employee = this.employeeService.getEmployeeById(
      this.employeeForm.get('id')?.value
    );
    // Check if it's an add mode and if an employee with the same ID already exists
    if (this.isAddMode && employee) {
      // If so, show an error toast indicating that the ID already exists
      this.toast.error({
        detail: `Same ID exists!`,
        summary: `ID can't be duplicate`,
        duration: 2000,
      });
      return; // Exit the function
    }
    
    // Get the name of the employee from the form
    let employeeName: string = this.employeeForm.get('name')?.value;
    
    if (this.isAddMode) {
      // If it's in add mode, call the employee service to add the new employee
      this.employeeService.addEmployee(this.employeeForm.value);
      // Show success toast indicating that the employee has been added
      this.showSuccessToast(employeeName, 'added');
    } else {
      // If it's in edit mode, call the employee service to update the employee
      this.employeeService.updateEmployee(
        this.employeeId,
        this.employeeForm.value
      );
      // Show success toast indicating that the employee has been updated
      this.showSuccessToast(employeeName, 'updated');
    }
    
    // After adding or updating, navigate back to the employees page
    this.router.navigate(['/employees']);
  }
}    