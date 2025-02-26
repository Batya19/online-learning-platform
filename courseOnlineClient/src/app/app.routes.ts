import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CourseListComponent } from './components/courses/course-list/course-list.component';
import { MyCoursesComponent } from './components/courses/my-courses/my-courses.component';
import { CourseDetailComponent } from './components/courses/course-detail/course-detail.component';
import { CourseManagementComponent } from './components/admin/course-management/course-management.component';
import { AuthGuard } from './guards/auth.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },
    { path: 'my-courses', component: MyCoursesComponent, canActivate: [AuthGuard] },
    { path: 'courses/:id', component: CourseDetailComponent, canActivate: [AuthGuard] },
    { path: 'manage-courses', component: CourseManagementComponent, canActivate: [AuthGuard, TeacherGuard] },
    { path: '**', redirectTo: '' }
];