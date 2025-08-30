// SNS 애플리케이션 메인 로직
class SNSApp {
    constructor() {
        this.currentUserName = '익명사용자'; // 기본 사용자 이름
        this.userAvatars = {}; // 사용자별 아바타 저장
        this.profileImages = [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDacPeKX6OLLy_jCLRUZb4qmjrFFU7LqkMNBudXvPHrxAzmmV0bXVOejRFOBCj7mwHeydXwXGWMr6nuS0357fmF73grB6ZQU67X89IOvZIt4zrvvm_0Zz-FWE8O5N39OHDPWhPGAvY1lth9jO4qAyoQRQjgRtnFoZYLhmFy7gjghwh8ecBYNeJUOHsKlFVb5RX12YAJvcZ0pLhciMKhS6Uzrkc3xzdxZ7NWM2e19H2QcWD2lG0RYCuV630yc1LpYYbYfFSVWHGr1Xc',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDuLMAItjJMXIl4bA6wHUZWellDgg99V-YCOGKkvkFrX53HImD-IX2-UoK-6i99FqxNgVCLJtbqbPbaY9dF22ojia3SEL1UEaAxFYKncUHt4Ky18GZom2wtLEkiWeuDkjwTUJbl1gGdRItqYNdzvasJCHHEgGEoWabC2rT4GppeNylKyHAOvwQ4FkWvfB4y-Cp4MaqVJzwKkXobqcXcjFdId3SPEUicbVyYK3eO_iPu8t6ZsczSFByeD4GHbbNjSsb3wflFbaZ9dAc',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAadqWTW8F0krd9tphjiK3W201xNMsewPKu6RyngLwzvM9-ifRwp-hFsqPPhmT2d8QBusE14T13xXvQ1HvMg-_KgY8T2UqM6C6v5zcd4I_QW1rqbvmwx2m68ODIP0C7j6q-TTQlP_3Rpx1QaOUTvyoUEF7__vgPKV_pqjrBv2ofGyqinSqHhPZrPZM2GeEVuwoEs2lv3c021kzl9A4QhSjNb_T5vo3_tjYUNjFIn686gIEBRSk6H7AHO4YJs1CmZgWSKJ841YQOazQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA7hObheWSPlJKoZ-v-C1eQ1AbSQpihwZGJntoEiUQkJnRxA7czi_-bTpcfzQt_ImwSkl0mc0b4KNG7NWsOYPn329XepdxzVQnu3-Y8vG4pBipM7EPrKqf0uB_3flP76C1limeCwX-_6Fz3qYPQgsLaL6CxItDaUnrA9XYputYj2f03J_zETMDGEmjOeujV1LJoNO4l5EYlICKZXKMbIIo2F4dsN7kRAegQNe8VplDaUirj-iviYe8H_hz-YE06qidLD8x0ycEctjE'
        ];
        this.initializeEventListeners();
        this.setupUserName();
        this.loadUserAvatars(); // 사용자별 아바타 로드
        this.loadPosts(); // 페이지 로드 시 게시물 불러오기
    }

    // 랜덤 사용자 이름 생성
    generateRandomUserName() {
        const adjectives = ['귀여운', '멋진', '똑똑한', '재미있는', '활발한', '친절한', '창의적인', '용감한', '차분한', '유쾌한'];
        const animals = ['고양이', '강아지', '토끼', '다람쥐', '판다', '코알라', '펭귄', '돌고래', '사자', '호랑이'];
        
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        const randomNumber = Math.floor(Math.random() * 1000);
        
        return `${randomAdjective}${randomAnimal}${randomNumber}`;
    }

    // 사용자 이름 설정
    setupUserName() {
        // 로컬 스토리지에서 사용자 이름 가져오기
        const savedUserName = localStorage.getItem('sns_user_name');
        if (savedUserName) {
            this.currentUserName = savedUserName;
            // 화면에 사용자 이름 표시
            this.displayUserName();
        } else {
            // 처음 방문시 사용자 설정 모달 표시
            this.showUserSetupModal();
        }
    }

    // 사용자 설정 모달 표시
    showUserSetupModal() {
        // 메인 컨텐츠 숨기기
        const mainContent = document.querySelector('.layout-content-container');
        if (mainContent) {
            mainContent.style.display = 'none';
        }

        // 모달 생성
        const modal = this.createUserSetupModal();
        document.body.appendChild(modal);
    }

    // 사용자 설정 모달 생성
    createUserSetupModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.id = 'user-setup-modal';

        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold text-[#111418] mb-6 text-center">프로필 설정</h2>
                
                <!-- 사용자 이름 입력 -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-[#111418] mb-2">사용자 이름</label>
                    <div class="flex gap-2">
                        <input 
                            type="text" 
                            id="username-input"
                            class="flex-1 px-3 py-2 border border-[#dbe0e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d99f5]"
                            placeholder="사용자 이름을 입력하세요"
                            value="${this.generateRandomUserName()}"
                        />
                        <button 
                            id="random-name-btn"
                            class="px-4 py-2 bg-[#f0f2f5] text-[#111418] rounded-lg hover:bg-[#dbe0e6] transition-colors"
                        >
                            랜덤
                        </button>
                    </div>
                </div>

                <!-- 프로필 이미지 선택 -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-[#111418] mb-3">프로필 이미지</label>
                    <div class="grid grid-cols-4 gap-3" id="profile-selection">
                        ${this.profileImages.map((image, index) => `
                            <div 
                                class="profile-option w-16 h-16 bg-cover bg-center rounded-full border-2 border-transparent cursor-pointer hover:border-[#3d99f5] transition-colors"
                                style="background-image: url('${image}')"
                                data-index="${index}"
                            ></div>
                        `).join('')}
                    </div>
                </div>

                <!-- 버튼들 -->
                <div class="flex gap-3">
                    <button 
                        id="setup-complete-btn"
                        class="flex-1 bg-[#3d99f5] text-white py-2 px-4 rounded-lg hover:bg-[#2b7ce9] transition-colors"
                    >
                        시작하기
                    </button>
                </div>
            </div>
        `;

        // 이벤트 리스너 추가
        this.setupModalEventListeners(modal);

        return modal;
    }

    // 모달 이벤트 리스너 설정
    setupModalEventListeners(modal) {
        const usernameInput = modal.querySelector('#username-input');
        const randomNameBtn = modal.querySelector('#random-name-btn');
        const profileOptions = modal.querySelectorAll('.profile-option');
        const completeBtn = modal.querySelector('#setup-complete-btn');

        let selectedProfileIndex = 0; // 기본 선택
        profileOptions[0].classList.add('border-[#3d99f5]'); // 첫 번째 프로필 기본 선택

        // 랜덤 이름 생성 버튼
        randomNameBtn.addEventListener('click', () => {
            usernameInput.value = this.generateRandomUserName();
        });

        // 프로필 이미지 선택
        profileOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
                // 기존 선택 해제
                profileOptions.forEach(opt => opt.classList.remove('border-[#3d99f5]'));
                // 새로운 선택 적용
                option.classList.add('border-[#3d99f5]');
                selectedProfileIndex = index;
            });
        });

        // 설정 완료 버튼
        completeBtn.addEventListener('click', () => {
            const userName = usernameInput.value.trim();
            if (!userName) {
                alert('사용자 이름을 입력해주세요!');
                return;
            }

            // 사용자 정보 저장
            this.currentUserName = userName;
            localStorage.setItem('sns_user_name', userName);

            // 선택한 프로필 이미지 저장
            this.userAvatars[userName] = this.profileImages[selectedProfileIndex];
            this.saveUserAvatars();

            // 모달 제거 및 메인 컨텐츠 표시
            this.closeUserSetupModal();
            
            // 화면에 사용자 이름 표시
            this.displayUserName();
            
            // 게시물 목록 로드 (처음 설정 완료 후)
            this.loadPosts();
        });

        // Enter 키로 설정 완료
        usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                completeBtn.click();
            }
        });
    }

    // 사용자 설정 모달 닫기
    closeUserSetupModal() {
        const modal = document.getElementById('user-setup-modal');
        if (modal) {
            modal.remove();
        }

        // 메인 컨텐츠 표시
        const mainContent = document.querySelector('.layout-content-container');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    // 사용자 이름 화면에 표시
    displayUserName() {
        // 헤더의 사용자 이름 표시 영역 찾기
        const header = document.querySelector('header');
        const userNameDisplay = header.querySelector('.user-name-display');
        
        if (!userNameDisplay) {
            // 사용자 이름 표시 요소 생성
            const userNameElement = document.createElement('div');
            userNameElement.className = 'user-name-display text-sm text-[#60758a] mr-4';
            userNameElement.textContent = `안녕하세요, ${this.currentUserName}님!`;
            
            // 프로필 이미지 앞에 삽입
            const profileImage = header.querySelector('.bg-cover');
            profileImage.parentNode.insertBefore(userNameElement, profileImage);
        } else {
            userNameDisplay.textContent = `안녕하세요, ${this.currentUserName}님!`;
        }
    }

    // 이벤트 리스너 초기화
    initializeEventListeners() {
        // 게시물 작성 버튼 클릭 이벤트
        const postButton = document.querySelector('button');
        if (postButton) {
            postButton.addEventListener('click', this.handlePostSubmit.bind(this));
        }

        // Enter 키로 게시물 작성
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handlePostSubmit();
                }
            });
        }

        // 사용자 이름 변경 버튼 추가
        this.addUserNameChangeButton();
    }

    // 사용자 이름 변경 버튼 추가
    addUserNameChangeButton() {
        const header = document.querySelector('header');
        const userNameDisplay = header.querySelector('.user-name-display');
        
        if (userNameDisplay && !userNameDisplay.querySelector('.change-name-btn')) {
            const changeButton = document.createElement('button');
            changeButton.className = 'change-name-btn ml-2 text-xs text-[#3d99f5] hover:underline';
            changeButton.textContent = '프로필 변경';
            changeButton.addEventListener('click', this.showUserSetupModal.bind(this));
            userNameDisplay.appendChild(changeButton);
        }
    }

    // 사용자 이름 변경
    changeUserName() {
        const newUserName = this.generateRandomUserName();
        this.currentUserName = newUserName;
        localStorage.setItem('sns_user_name', this.currentUserName);
        
        // 새 사용자 이름에 대한 아바타 생성
        this.assignUserAvatar(this.currentUserName);
        this.saveUserAvatars();
        
        this.displayUserName();
        this.addUserNameChangeButton(); // 버튼 다시 추가
    }

    // 사용자별 아바타 로드
    loadUserAvatars() {
        const savedAvatars = localStorage.getItem('sns_user_avatars');
        if (savedAvatars) {
            this.userAvatars = JSON.parse(savedAvatars);
        }
    }

    // 사용자별 아바타 저장
    saveUserAvatars() {
        localStorage.setItem('sns_user_avatars', JSON.stringify(this.userAvatars));
    }

    // 사용자에게 아바타 할당
    assignUserAvatar(userName) {
        if (!this.userAvatars[userName]) {
            // 사용자 이름을 기반으로 일관된 랜덤 인덱스 생성
            let hash = 0;
            for (let i = 0; i < userName.length; i++) {
                const char = userName.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 32bit 정수로 변환
            }
            const index = Math.abs(hash) % this.profileImages.length;
            this.userAvatars[userName] = this.profileImages[index];
            this.saveUserAvatars();
        }
        return this.userAvatars[userName];
    }

    // 사용자 아바타 가져오기
    getUserAvatar(userName) {
        return this.assignUserAvatar(userName);
    }

    // 게시물 작성 처리
    async handlePostSubmit() {
        const textarea = document.querySelector('textarea');
        const content = textarea.value.trim();

        if (!content) {
            alert('게시물 내용을 입력해주세요!');
            return;
        }

        // 로딩 상태 표시
        const postButton = document.querySelector('button');
        const originalText = postButton.textContent;
        postButton.textContent = '작성 중...';
        postButton.disabled = true;

        try {
            // Supabase에 게시물 생성
            const result = await supabaseClient.createPost(this.currentUserName, content);

            if (result.success) {
                // 성공시 textarea 초기화
                textarea.value = '';
                alert('게시물이 성공적으로 작성되었습니다!');
                
                // 게시물 목록 새로고침
                this.loadPosts();
            } else {
                alert('게시물 작성에 실패했습니다: ' + result.error);
            }
        } catch (error) {
            console.error('게시물 작성 중 오류:', error);
            alert('게시물 작성 중 오류가 발생했습니다.');
        } finally {
            // 로딩 상태 해제
            postButton.textContent = originalText;
            postButton.disabled = false;
        }
    }

    // 게시물 목록 로드
    async loadPosts() {
        try {
            const result = await supabaseClient.getPosts();
            if (result.success) {
                this.renderPosts(result.data);
            } else {
                console.error('게시물 로드 실패:', result.error);
            }
        } catch (error) {
            console.error('게시물 로드 중 오류:', error);
        }
    }

    // 게시물 목록 렌더링
    renderPosts(posts) {
        const postsContainer = document.querySelector('.layout-content-container');
        const recentPostsSection = postsContainer.querySelector('h3');
        
        // 기존 게시물들 제거 (Recent Posts 제목 이후의 모든 게시물)
        let nextElement = recentPostsSection.nextElementSibling;
        while (nextElement) {
            const toRemove = nextElement;
            nextElement = nextElement.nextElementSibling;
            if (toRemove.classList.contains('flex') && toRemove.classList.contains('w-full')) {
                toRemove.remove();
            }
        }

        // 새로운 게시물들 추가
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }

    // 개별 게시물 요소 생성
    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'flex w-full flex-row items-start justify-start gap-3 p-4';
        
        // 사용자별 고유 아바타 가져오기
        const userAvatar = this.getUserAvatar(post.user_name);

        postDiv.innerHTML = `
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" 
                 style='background-image: url("${userAvatar}");'></div>
            <div class="flex h-full flex-1 flex-col items-start justify-start">
                <div class="flex w-full flex-row items-start justify-start gap-x-3">
                    <p class="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">${post.user_name}</p>
                    <p class="text-[#60758a] text-sm font-normal leading-normal">${this.formatTimeAgo(post.created_at)}</p>
                </div>
                <p class="text-[#111418] text-sm font-normal leading-normal">${post.content}</p>
            </div>
        `;

        return postDiv;
    }

    // 시간 포맷팅 (2h ago, 4h ago 등)
    formatTimeAgo(dateString) {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) {
            return '방금 전';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}분 전`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}시간 전`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}일 전`;
        }
    }
}

// DOM 로드 완료 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    const app = new SNSApp();
    console.log('SNS 앱이 초기화되었습니다.');
});
