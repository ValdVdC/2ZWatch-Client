import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService, Comment } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrls: ['./comments.css']
})
export class CommentsComponent implements OnInit {
  @Input() mediaType!: 'movie' | 'series';
  @Input() mediaId!: number;

  comments: Comment[] = [];
  newComment: string = '';
  editingCommentId: string | null = null;
  editingContent: string = '';
  isAuthenticated = false;
  currentUserId: string | null = null;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  errorMessage: string | null = null;
  showDeleteConfirm: string | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = (currentUser as any)?._id || null;
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentService.getComments(this.mediaType, this.mediaId, this.currentPage).subscribe({
      next: (data) => {
        this.comments = data.comments;
        this.totalPages = data.pagination.pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar comentários:', error);
        this.isLoading = false;
      }
    });
  }

  createComment(): void {
    if (!this.isAuthenticated) {
      this.showError('Você precisa estar logado para comentar');
      return;
    }

    if (!this.newComment.trim()) {
      return;
    }

    this.commentService.createComment(this.mediaType, this.mediaId, this.newComment).subscribe({
      next: (response) => {
        this.comments.unshift(response.comment);
        this.newComment = '';
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erro ao criar comentário:', error);
        this.showError('Erro ao criar comentário. Tente novamente.');
      }
    });
  }

  startEdit(comment: Comment): void {
    this.editingCommentId = comment._id;
    this.editingContent = comment.content;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editingContent = '';
  }

  saveEdit(commentId: string): void {
    if (!this.editingContent.trim()) {
      return;
    }

    this.commentService.updateComment(commentId, this.editingContent).subscribe({
      next: (response) => {
        const index = this.comments.findIndex(c => c._id === commentId);
        if (index !== -1) {
          this.comments[index] = response.comment;
        }
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Erro ao atualizar comentário:', error);
        this.showError('Erro ao atualizar comentário. Tente novamente.');
      }
    });
  }

  confirmDelete(commentId: string): void {
    this.showDeleteConfirm = commentId;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = null;
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c._id !== commentId);
        this.showDeleteConfirm = null;
      },
      error: (error) => {
        console.error('Erro ao deletar comentário:', error);
        this.showError('Erro ao deletar comentário. Tente novamente.');
        this.showDeleteConfirm = null;
      }
    });
  }

  toggleLike(commentId: string): void {
    if (!this.isAuthenticated) {
      this.showError('Você precisa estar logado para curtir');
      return;
    }

    this.commentService.toggleLike(commentId).subscribe({
      next: (response) => {
        const comment = this.comments.find(c => c._id === commentId);
        if (comment) {
          const likeIndex = comment.likes.indexOf(this.currentUserId!);
          if (likeIndex > -1) {
            comment.likes.splice(likeIndex, 1);
          } else {
            comment.likes.push(this.currentUserId!);
          }
        }
      },
      error: (error) => {
        console.error('Erro ao curtir:', error);
      }
    });
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  isCommentLiked(comment: Comment): boolean {
    return this.currentUserId ? comment.likes.includes(this.currentUserId) : false;
  }

  isCommentOwner(comment: Comment): boolean {
    return this.currentUserId === comment.userId._id;
  }

  getAvatarUrl(avatar?: string): string {
    if (!avatar) {
      return 'assets/placeholders/person.png';
    }
    if (avatar.startsWith('http')) {
      return avatar;
    }
    return `${environment.api.serverUrl}${avatar}`;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return commentDate.toLocaleDateString('pt-BR');
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadComments();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadComments();
    }
  }
}
