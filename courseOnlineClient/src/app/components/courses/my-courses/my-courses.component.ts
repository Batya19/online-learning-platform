import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';
import { User } from '../../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  enrolledCourses: Course[] = [];
  teacherCourses: Course[] = [];
  currentUser: User | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;

    if (this.currentUser) {
      if (this.currentUser.role === 'student') {
        this.loadEnrolledCourses();
      } else if (this.currentUser.role === 'teacher') {
        this.loadTeacherCourses();
      } else if (this.currentUser.role === 'admin') {
        this.loadAllCourses();
      }
    } else {
      this.error = 'User not authenticated.';
      this.loading = false;
    }
  }

  loadEnrolledCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load enrolled courses. Please try again later.';
        this.loading = false;
        console.error('Error loading enrolled courses:', err);
      }
    });
  }

  loadTeacherCourses(): void {
    this.courseService.getTeacherCourses().subscribe({
      next: (courses) => {
        this.teacherCourses = courses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your courses. Please try again later.';
        this.loading = false;
        console.error('Error loading teacher courses:', err);
      }
    });
  }

  loadAllCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.teacherCourses = courses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load courses. Please try again later.';
        this.loading = false;
        console.error('Error loading all courses:', err);
      }
    });
  }

  unenrollFromCourse(courseId: number): void {
    this.courseService.unenrollFromCourse(courseId).subscribe({
      next: () => {
        this.enrolledCourses = this.enrolledCourses.filter(course => course.id !== courseId);
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

  deleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.teacherCourses = this.teacherCourses.filter(course => course.id !== courseId);
          this.snackBar.open('Course deleted successfully.', 'Close', {
            duration: 3000
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to delete the course. Please try again.', 'Close', {
            duration: 3000
          });
          console.error('Error deleting course:', err);
        }
      });
    }
  }
}