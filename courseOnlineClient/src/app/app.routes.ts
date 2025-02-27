import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CourseListComponent } from './components/courses/course-list/course-list.component';
import { MyCoursesComponent } from './components/courses/my-courses/my-courses.component';
import { CourseManagementComponent } from './components/admin/course-management/course-management.component';
import { AuthGuard } from './guards/auth.guard';
import { TeacherGuard } from './guards/teacher.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },
    { path: 'my-courses', component: MyCoursesComponent, canActivate: [AuthGuard] },
    { path: 'manage-courses', component: CourseManagementComponent, canActivate: [TeacherGuard] },
    { path: '**', redirectTo: '' } // Wildcard route for a 404 page
];