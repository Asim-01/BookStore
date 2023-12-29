// Decorators and Lifehooks
import { Component, OnInit, OnDestroy } from '@angular/core';

// Forms
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Router
import { Router } from '@angular/router';

// RXJS
import { Subscription } from 'rxjs';

// Services
import { HelperService } from '../../../core/services/helper.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  isLoggedSub$: Subscription;
  cartStatusSub$: Subscription;
  username: string;
  isLogged: boolean;
  isAdmin: boolean;
  statusChecker: number;
  cartItems: number;
  categories: string[] = ['Action|Adventure','Biographies','Fiction', 'Mystery', 'Romance', 'Science', 'Fantasy'];
  selectedCategory: string = ''; // Initialize with an empty string

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    // Perform book filtering based on the selected category here.
    // You can call a service or set filters in your book search logic.
    // For example, if you have a books array, you can filter it based on the selectedCategory.
    console.log('Selected Category:', this.selectedCategory);
    if (category) {
      this.router.navigate([`/book/store/${category}`]);
    } else {
      // Handle the case when "All Categories" is selected, you might want to navigate to a default route.
    }
  }

  constructor(
    private router: Router,
    private helperService: HelperService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.statusChecker = window.setInterval(() => this.tick(), 600000);
    this.isLogged = this.helperService.isLoggedIn();
    this.initForm();
    if (this.isLogged) {
      this.getCartSize();
    }

    this.isLoggedSub$ = this.helperService
      .isUserLogged
      .subscribe((data) => {
        this.isLogged = data;
      });

    this.cartStatusSub$ = this.helperService
      .cartStatus
      .subscribe((data) => {
        if (data === 'add') {
          this.cartItems++;
        } else if (data === 'remove') {
          this.cartItems--;
        } else if (data === 'updateStatus') {
          this.getCartSize();
        }
      });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.statusChecker);
    this.isLoggedSub$.unsubscribe();
    this.cartStatusSub$.unsubscribe();
  }

  initForm(): void {
    this.searchForm = new FormGroup({
      'query': new FormControl('', [
        Validators.required
      ])
    });
  }

  // onSubmit(): void {
  //   const query: string = this.searchForm.value.query.trim();
  //   if (query.length !== 0) {
  //     this.router.navigate([`/book/store/${query}`]);
  //     this.helperService.searchQuery.next();
  //   }
  // }

  onSubmit(): void {
    const query: string = this.searchForm.value.query.trim();
    if (query.length !== 0) {
      this.router.navigate([`/book/store/${query}`]);
      this.helperService.searchQuery.next(query); // Provide the query as the argument
    }
  }
  

  tick(): void {
    this.isLogged = this.helperService.isLoggedIn();
  }

  isUserLogged(): boolean {
    return this.isLogged;
  }

  isUserAdmin(): boolean {
    if (!this.isAdmin) {
      this.isAdmin = this.helperService.isAdmin();
    }

    return this.isAdmin;
  }

  getUsername(): void {
    if (!this.username) {
      this.username = this.helperService.getProfile().username;
    }
  }

  getCartSize(): void {
    this.cartService
      .getCartSize()
      .subscribe((res) => {
        this.cartItems = res.data;
      });
  }

  logout(): void {
    this.username = undefined;
    this.isAdmin = undefined;
    this.cartItems = undefined;
    this.helperService.clearSession();
    this.helperService.isUserLogged.next(false);
  }
}
