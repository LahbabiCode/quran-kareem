import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SurahListComponent } from './components/surah-list/surah-list.component';
import { ReciterListComponent } from './components/reciter-list/reciter-list.component';
import { RadioComponent } from './components/radio/radio.component';
import { SurahDetailComponent } from './components/surah-detail/surah-detail.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { QiblaComponent } from './components/qibla/qibla.component';
import { PrayerTimesComponent } from './components/prayer-times/prayer-times.component';
import { ReciterDetailComponent } from './components/reciter-detail/reciter-detail.component';
import { AboutComponent } from './components/about/about.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'surahs', component: SurahListComponent },
  { path: 'surah/:id', component: SurahDetailComponent },
  { path: 'reciters', component: ReciterListComponent },
  { path: 'reciter/:id', component: ReciterDetailComponent },
  { path: 'radio', component: RadioComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'bookmarks', component: BookmarksComponent },
  { path: 'qibla', component: QiblaComponent },
  { path: 'prayer-times', component: PrayerTimesComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];