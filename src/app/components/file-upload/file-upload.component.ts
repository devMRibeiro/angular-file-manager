import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent implements OnInit {
  currentFile?: File;
  message = '';
  fileInfos?: Observable<any>;
  
  constructor(private uploadService: FileUploadService) { }

  selectFile(event: any): void {
    this.currentFile = event.target.files.item(0);
  }

  fileName: string | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.fileName = file ? file.name : null;
  }

  upload(): void {
    if (this.currentFile) {
      this.uploadService.upload(this.currentFile).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        error: (err: Error) => {
          console.log(err.message);
          this.message = err.message;
        },
        complete: () => {
          this.currentFile = undefined;
        },
      });
    }
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }
}