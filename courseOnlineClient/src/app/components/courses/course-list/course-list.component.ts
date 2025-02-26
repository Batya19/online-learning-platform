import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-course-list',
  imports: [ MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgIf,
    NgFor,
    RouterModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})

export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  enrolledCourseIds: number[] = [];
  loading: boolean = true;
  error: string = '';
  currentUserId: number | null = null;
  
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadCourses();
  }

  loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.currentUserId = user.id;
      this.loadEnrolledCourses();
    }
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load courses. Please try again later.';
        this.loading = false;
        console.error('Error loading courses:', err);
      }
    });
  }

  loadEnrolledCourses(): void {
    if (!this.currentUserId) return;
    
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.enrolledCourseIds = courses.map(course => course.id as number);
      },
      error: (err) => {
        console.error('Error loading enrolled courses:', err);
      }
    });
  }

  isEnrolled(courseId: number): boolean {
    return this.enrolledCourseIds.includes(courseId);
  }

  enrollToCourse(courseId: number): void {
    this.courseService.enrollToCourse(courseId).subscribe({
      next: () => {
        this.enrolledCourseIds.push(courseId);
        this.snackBar.open('Successfully enrolled in the course!', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to enroll in the course. Please try again.', 'Close', {
          duration: 3000
        });
        console.error('Error enrolling to course:', err);
      }
    });
  }

  unenrollFromCourse(courseId: number): void {
    this.courseService.unenrollFromCourse(courseId).subscribe({
      next: () => {
        this.enrolledCourseIds = this.enrolledCourseIds.filter(id => id !== courseId);
        this.snackBar.open('Successfully unenrolled from the course.', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to unenroll from the course. Please try again.', 'Close', {
          duration: 3000
        });
        console.error('Error unenrolling from course:', err);
      }
    });
  }
}
