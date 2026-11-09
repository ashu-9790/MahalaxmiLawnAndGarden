import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-launch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './launch.html',
  styleUrl: './launch.css'
})
export class LaunchComponent {
  private router = inject(Router);

  isLaunching = signal(false);
  hasLaunched = signal(false);
  countdown = signal<number | null>(null);

  // Confetti particles generator
  particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 8 + Math.random() * 12,
    color: ['#84b868', '#f0a500', '#ffffff', '#5a8742', '#ffd166', '#a3c4bc'][i % 6],
    rotation: Math.random() * 360
  }));

  startLaunch() {
    if (this.isLaunching() || this.hasLaunched()) return;

    this.isLaunching.set(true);
    this.playCelebrationSound();

    let count = 3;
    this.countdown.set(count);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdown.set(count);
        this.playBeepSound(400 + (3 - count) * 150);
      } else {
        clearInterval(interval);
        this.countdown.set(null);
        this.hasLaunched.set(true);
        this.playSuccessChime();

        // Redirect to home page after 3.5 seconds of celebration
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3800);
      }
    }, 900);
  }

  skipToHome() {
    this.router.navigate(['/']);
  }

  // Synthesize pleasant celebratory audio using native Web Audio API (zero external assets needed)
  private playBeepSound(frequency: number) {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }

  private playCelebrationSound() {
    this.playBeepSound(523.25); // C5
  }

  private playSuccessChime() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major celebratory chord)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.9);
      });
    } catch {}
  }
}
