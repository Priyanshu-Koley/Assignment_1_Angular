// employee-add-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/manage-employee.service';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './employee-add-edit.component.html',
  styleUrls: ['./employee-add-edit.component.scss']
})
export class EmployeeAddEditComponent implements OnInit {
  employeeForm!: FormGroup;
  isAddMode!: boolean;
  employeeId!: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.params['id'];
    this.isAddMode = isNaN(this.employeeId);

    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      skills: this.formBuilder.array([
        this.createSkillFormGroup()
      ])
    });

    if (!this.isAddMode) {
      const employee = this.employeeService.getEmployeeById(this.employeeId);
      if (employee) {
        // Patching values for top-level controls
        this.employeeForm.patchValue({
          name: employee.name,
          contactNumber: employee.contactNumber,
          email: employee.email,
          gender: employee.gender
        });
    
        // Patching values for skills FormArray
        const skillsFormArray = this.employeeForm.get('skills') as FormArray;
        skillsFormArray.clear(); // Clear existing skills
        
        // Add new skills based on employee data
        for (const skill of employee.skills) {
          skillsFormArray.push(this.formBuilder.group({
            skillName: skill.skillName,
            experience: skill.experience
          }));
        }
      } else {
        console.log('Employee not found!');
      }
    }

  }

  private createSkillFormGroup() {
    return this.formBuilder.group({
      skillName: ['', Validators.required],
      experience: ['', Validators.required]
    });
  }

  get skills() {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.createSkillFormGroup());
  }

  deleteSkill(index: number) {
    this.skills.removeAt(index);
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      alert("Invalid Input!");
      return;
    }

    if (this.isAddMode) {
      this.employeeService.addEmployee(this.employeeForm.value);
    } else {
      this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value);
    }
    this.router.navigate(['/employees']);
  }
}
