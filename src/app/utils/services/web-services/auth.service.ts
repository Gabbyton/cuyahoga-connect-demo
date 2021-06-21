import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../data/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private storage: AngularFirestore,
  ) {
    this.user$ = this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.storage.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      }),
    );
  }

  user$: Observable<User | null | undefined> | null = null;

  async login() {
    const credential = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    // this.updateUserData(credential.user);
  }

  updateUserData(user: firebase.User | null) {
    if (user != null) {
      const docRef = this.storage.doc(`users/${user.uid}`);
      const data = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      };
      docRef.set(data, { merge: true });
    }
  }

  logout() {
    this.auth.signOut();
  }
}
