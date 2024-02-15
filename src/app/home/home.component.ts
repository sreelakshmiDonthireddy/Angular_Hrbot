import { Component, ElementRef, ViewChild, OnDestroy,HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'
import { ChatService } from '../common/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  @ViewChild('expandingTextarea', { static: false }) expandingTextarea!: ElementRef;
  @ViewChild('scrollingTextarea', { static: false }) scrollingTextarea!: ElementRef;
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  userInput!: string;
  like!: string;
  dislike!: string;
  currentIndex = 0;
  isChatLoading = false;
  chatMessages: { question: string, answer: string, source: string, editMode: boolean, liked: boolean }[] = [];
  dummy = '<br>Citation:'
  isLogoutButtonVisible: boolean = false;
  isSendButtonEnabled: boolean = false;
  isCarouselVisible: boolean = true;
  sentMessage: string | undefined;
  sentImageSrc: string | undefined;
  isMessageSent: boolean = false;
  userClickedLikeIcon: any = undefined;
  showDialogueBox: boolean = false;
  closeDialogueBox: boolean = false;
  showDislikeBox: boolean = false;
  isSendingMessage: boolean = true;
  showIcons: boolean = false;
  likeClicked: boolean = false;
  dislikeClicked: boolean = false;
  isCopying: boolean[] = new Array(this.chatMessages.length).fill(false);
  editingIndex: number | null = null;
  showScrollToBottom = false;
  scrollThresholdHeight = 300;
  isGeneratingAnswer : boolean = false;
  isStopGeneratingVisible : boolean=false;
  isMessageGenerated:boolean = false;

  images = [
    {
      title: 'Comprehensive Labour Law Knowledge', src1: "assets/home_images/Des1.png", src2: "assets/home_images/Des2.png",
      description: "Labor Law Bot can provide relevant information on topics such as minimum wage, working hours, employee rights, discrimination laws, and more."
    },
    { title: 'Examples', src1: "assets/home_images/team-doctors.png", src2: "assets/home_images/bussiness-people.png", description: "“What is the minimum wage of california” “I have a safety complaint? How do I file it.”" },
    { title: 'Real-time Updates', src1: "assets/home_images/ability1.png", src2: "assets/home_images/ability2.png", description: "“The chatbot regularly updates its knowledge base to stay current with any changes in labor laws, ensuring that the information it provides is accurate and reliable.”" },
    { title: 'Limitations', src1: "assets/home_images/limitation1.png", src2: "assets/home_images/limitation2.png", description: "“May occasionally generate incorrect information”" },
  ];

  constructor(config: NgbCarouselConfig, private router: Router, private chatService: ChatService,private elementRef: ElementRef) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnDestroy(): void {
  }

  sendMessage() {
    const message = this.userInput.trim();
    if (message && !this.isChatLoading) {
      this.userInput = '';
      this.isChatLoading = true;
      this.editingIndex = null;
      this.isCarouselVisible = false;
      this.isSendingMessage = false;
      this.isMessageSent = true;
      this.isStopGeneratingVisible=true
      this.isMessageGenerated = true;
      this.isGeneratingAnswer=true;

      const newMessage = { question: message, answer: '', source: '', editMode: false, liked: false };
      this.chatMessages.push(newMessage);
      this.currentIndex = this.chatMessages.length;
      this.replyToQuestion(newMessage)
        .then((updatedMessage: any) => {
          const index = this.chatMessages.indexOf(newMessage);
          if (index !== -1) {
            this.chatMessages[index] = updatedMessage;
          }
          this.isChatLoading = false;
          this.isCopying = new Array(this.chatMessages.length).fill(false);
          this.sentImageSrc = 'assets/home_images/Profile.png';
          this.isSendButtonEnabled = false;
          this.showIcons = true;
        })
        .catch((error: any) => {
          // Promise rejected with an error, handle the error here
          console.error('Error in sendMessage:', error);
        });
    }
  }

  replyToQuestion(message: { question: string; answer: string; source: string; editMode: boolean; liked: boolean }): Promise<any> {
    return new Promise((resolve, reject) => {
      const lowercaseQuestion = message.question.toLowerCase();
      console.log(this.currentIndex);
      this.chatService.generateChat([message.question]).subscribe(
        (res: any) => {
          console.log(res)
          if (lowercaseQuestion.includes('hii')) {
            var answer = 'Hello!! How can I assist you?';
            message.answer = answer;
          } else if (lowercaseQuestion.includes('how are you doing?')) {
            message.answer = 'Im doing good';
          } else {
            answer = res['response'];
            if (answer.includes('SOURCES:')) {
              const splitText = answer.split('SOURCES:');
              message.source = splitText[1] ? splitText[1].trim() : '';
              if (message.source != '') {
                answer = splitText[0].trim() + '<br>Citation: <a href="https://auraf2-dev.mouritech.net/app/States">' + splitText[1].trim() + '</a>';
                message.answer = answer;
              } else {
                message.answer = splitText[0].trim();
              }
            } else {
              const sourceRegex = /\(Source: (.*)\)/;
              const sourceMatch = answer.match(sourceRegex);
              const splitText = sourceMatch ? [answer.replace(sourceMatch[0], ''), sourceMatch[1]] : [answer];
              message.source = splitText[1] ? splitText[1].trim() : '';
              if (message.source != '') {
                answer = splitText[0].trim() + '<br>Citation: <a href="https://auraf2-dev.mouritech.net/app/admin/main/States">' + splitText[1].trim() + '</a>';
                message.answer = answer;
              } else {
                message.answer = splitText[0].trim();
              }
            }
          }
          resolve(message); // Resolve the promise with the message
          this.isGeneratingAnswer = false; 
          this.isStopGeneratingVisible = true;
        },
        (error: any) => {
          reject(error); // Reject the promise if there's an error
          this.isGeneratingAnswer = false; 
          this.isStopGeneratingVisible = true;
          console.error('Error fetching updated answer:', error);
        }
      );
    });
  }

  toggleSendButton() {
    this.isSendButtonEnabled = this.userInput.trim() !== '';
  }

  toggleLogoutButton(event: Event) {
    event.preventDefault();
    this.isLogoutButtonVisible = !this.isLogoutButtonVisible;
  }

  logout() {
    this.router.navigate(['/']);
  }

  preventClose(event: Event) {
    event.stopPropagation();
  }

  editQuestion(message: any) {
    message.editMode = true;
    message.originalQuestion = message.question;
  }

  submitQuestion(message: any, index: number) {
    const editedQuestion = message.question;
    message.editMode = false;
    message.answer = '';

    this.editingIndex = index;

    if (editedQuestion !== message.originalQuestion && !this.isChatLoading) {
      this.isChatLoading = true;
      message.question = editedQuestion;
      var updatedMessage = { ...message, answer: '' }; // Create a new object with the updated question and an empty answer
      this.replyToQuestion(message)
        .then((response: any) => {
          updatedMessage.answer = response.answer; // Update the answer property with the response

          // Update the chatMessages array with the updated message
          this.chatMessages[index] = updatedMessage;

          // Update the editingIndex to indicate the location
          this.isChatLoading = false;
          // this.isStopGeneratingVisible = false;
        })
        .catch((error: any) => {
          console.error('Error fetching updated answer:', error);
        });
    }
  }

  cancelEdit(message: any, index: number) {
    message.editMode = false;
    message.question = message.originalQuestion;
    this.editingIndex = null;
  }

  cancelEditAll() {
    this.chatMessages.forEach(m => m.editMode = false);
  }

  likeMessage() {
    this.showDialogueBox = true;
    this.closeDialogueBox = false;
  }

  dislikeMessage() {
    this.showDislikeBox = true;
    this.closeDialogueBox = false;
  }
  onCancelClicked(value: any) {
    this.closeDialogueBox = value;
    this.showDialogueBox = false;
  }
  cancelButtonClick(value: any) {
    this.closeDialogueBox = value
    this.showDislikeBox = false;
  }

  adjustTextareaHeight(textareaElement: HTMLTextAreaElement, maxLines?: number) {
    const minHeight = 60; // Set a minimum height for the textarea to prevent it from shrinking too much

    const textarea = textareaElement;
    textarea.style.height = 'auto'; // Reset the height to auto to recalculate

    // Calculate the height required for the content
    const newHeight = Math.max(minHeight, textarea.scrollHeight);
    console.log(newHeight);
    if (maxLines) {
      // If maxLines is defined and the current number of rows exceeds it, show the scrollbar
      textarea.style.overflowY = 'auto';
      textarea.style.height = `${newHeight}px`;

      //set div height 
      var div = document.querySelector('.prompt-textarea-container') as HTMLElement;
      if (div !== null) {
        
        // Get the current height of the textarea (including padding)
        const textareaHeight = textarea.scrollHeight;
        // Limit the div height to a maximum of 200px
        const maxDivHeight = 200;
        const newDivHeight = Math.min(textareaHeight, maxDivHeight);

        div.style.height = `${Math.max(minHeight, newDivHeight)}px`;
      }

    } else {
      // Otherwise, adjust the height to fit the content
      textarea.style.overflowY = 'auto';
      textarea.style.height = `${newHeight}px`;
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
  }

  copyToClipboard(text_to_copy: string, index: number) {
    console.log(text_to_copy, index);
    navigator.clipboard.writeText(this.removeHtmlTags(text_to_copy))
      .then(() => {
        this.toggleIcon(index);
        setTimeout(() => {
          this.toggleIcon(index);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error in copying: ", error);
      });
  }

  toggleIcon(index: number) {
    this.isCopying[index] = !this.isCopying[index];
  }

  removeHtmlTags(text: string): string {
    // Regular expression to match anchor tags and extract the link and inner text
    const anchorTagRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
  
    // Check if the text contains any HTML tags
    if (/<\/?[a-z][\s\S]*>/i.test(text)) {
      // Regular expression to match HTML tags
      const htmlTagRegex = /<[^>]*>/g;
      
      // Extract and format anchor tags
      const formattedText = text.replace(anchorTagRegex, (match, openingQuote, link, innerText) => {
        return `${innerText} (${link})`;
      });
      // Remove HTML tags from the text
      const textWithoutHtmlTags = formattedText.replace(htmlTagRegex, '');
  
      return textWithoutHtmlTags;
    } else {
      // No HTML tags found, return the text as it is
      return text;
    }
  }
  

  onChatScroll() {
    const chatContainer = this.chatContainer.nativeElement as HTMLElement;
    // Check if the chat container's scroll height exceeds the threshold height
    this.showScrollToBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight >= this.scrollThresholdHeight;
  }

  scrollToBottom() {
    const chatContainer = this.chatContainer.nativeElement as HTMLElement;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    this.showScrollToBottom = false;
  }

  onTypingStart(){
    this.isGeneratingAnswer=true;
    console.log(this.isGeneratingAnswer);
  }
  onTypingStop(){
    this.isGeneratingAnswer=false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const dropdownMenu = this.elementRef.nativeElement.querySelector('.logout-btn');
    if (!dropdownMenu.contains(targetElement) && !targetElement.classList.contains('dropdown-toggle')) {
      this.isLogoutButtonVisible = false;
    }
  }
  toggleGenerating() {
    if (this.isStopGeneratingVisible) {
      this.stopGenerating();
    } else {
      this.regenerateAnswer();
    }
  }
  regenerateAnswer() {
    this.isGeneratingAnswer = true;
    this.isMessageGenerated = true;
    this.isStopGeneratingVisible = true;
  }
  stopGenerating() {
    this.isGeneratingAnswer = false;
    this.isMessageGenerated = true;
    this.isStopGeneratingVisible = false;
  }
}