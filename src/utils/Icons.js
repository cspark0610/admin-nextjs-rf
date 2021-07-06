class Icon {
    constructor(viewBox, svg) {
      this.viewBox = viewBox
      this.svg = <>{svg}</>
    }
  }

  const svgs = {
  'double-arrow': new Icon("0 0 14 15", <g><path d="M5.83749 14.0013C5.68809 14.0018 5.54048 13.9688 5.4055 13.9048C5.27052 13.8407 5.15161 13.7473 5.05749 13.6313L0.227488 7.63125C0.0804062 7.45232 0 7.22788 0 6.99625C0 6.76463 0.0804062 6.54018 0.227488 6.36125L5.22749 0.361252C5.39723 0.157036 5.64114 0.0286112 5.90556 0.0042315C6.16999 -0.0201482 6.43327 0.0615137 6.63749 0.231252C6.8417 0.400991 6.97013 0.644902 6.99451 0.909329C7.01889 1.17375 6.93723 1.43704 6.76749 1.64125L2.29749 7.00125L6.61749 12.3613C6.73977 12.508 6.81745 12.6868 6.84133 12.8763C6.86521 13.0659 6.83429 13.2583 6.75223 13.4308C6.67018 13.6034 6.54042 13.7488 6.37831 13.8499C6.2162 13.9509 6.02852 14.0035 5.83749 14.0013Z" fill="currentColor"/><path d="M12.8375 14.0013C12.6881 14.0018 12.5405 13.9688 12.4055 13.9048C12.2705 13.8407 12.1516 13.7473 12.0575 13.6313L7.22749 7.63125C7.08041 7.45232 7 7.22788 7 6.99625C7 6.76463 7.08041 6.54018 7.22749 6.36125L12.2275 0.361252C12.3972 0.157036 12.6411 0.0286112 12.9056 0.0042315C13.17 -0.0201482 13.4333 0.0615137 13.6375 0.231252C13.8417 0.400991 13.9701 0.644902 13.9945 0.909329C14.0189 1.17375 13.9372 1.43704 13.7675 1.64125L9.29749 7.00125L13.6175 12.3613C13.7398 12.508 13.8174 12.6868 13.8413 12.8763C13.8652 13.0659 13.8343 13.2583 13.7522 13.4308C13.6702 13.6034 13.5404 13.7488 13.3783 13.8499C13.2162 13.9509 13.0285 14.0035 12.8375 14.0013Z" fill="currentColor"/></g>),
  'family': new Icon("0 0 21 20", <path d="M14 2C14 0.89 14.89 0 16 0C17.11 0 18 0.89 18 2C18 3.11 17.11 4 16 4C14.89 4 14 3.11 14 2ZM18 19V14H19.11C19.79 14 20.27 13.33 20.06 12.68L17.96 6.37C17.8262 5.97171 17.571 5.62536 17.2302 5.37962C16.8894 5.13389 16.4802 5.00113 16.06 5H15.94C15.5195 4.99962 15.1095 5.13179 14.7684 5.37774C14.4274 5.62369 14.1725 5.97089 14.04 6.37L13.18 8.95C14.26 9.55 15 10.68 15 12V20H17C17.55 20 18 19.55 18 19ZM10.5 9.5C11.33 9.5 12 8.83 12 8C12 7.17 11.33 6.5 10.5 6.5C9.67 6.5 9 7.17 9 8C9 8.83 9.67 9.5 10.5 9.5ZM3.5 4C4.61 4 5.5 3.11 5.5 2C5.5 0.89 4.61 0 3.5 0C2.39 0 1.5 0.89 1.5 2C1.5 3.11 2.39 4 3.5 4ZM5.5 19V13H6C6.55 13 7 12.55 7 12V7C7 5.9 6.1 5 5 5H2C0.9 5 0 5.9 0 7V12C0 12.55 0.45 13 1 13H1.5V19C1.5 19.55 1.95 20 2.5 20H4.5C5.05 20 5.5 19.55 5.5 19ZM8 12V15C8 15.55 8.45 16 9 16V19C9 19.55 9.45 20 10 20H11C11.55 20 12 19.55 12 19V16C12.55 16 13 15.55 13 15V12C13 11.18 12.32 10.5 11.5 10.5H9.5C8.68 10.5 8 11.18 8 12Z" fill="currentColor"/>),
  'users': new Icon("0 0 640 512", <path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"/>),
	'misc': new Icon("0 0 15 16", <path d="M11.4469 12.1606L11.9359 11.6749C14.1981 11.7488 14.2329 11.6695 14.3323 11.4369L14.9538 9.92389L15 9.78047L14.9495 9.65497C14.9229 9.58869 14.8408 9.39093 13.4283 8.04414V7.3357C15.0581 5.76562 15.0234 5.68521 14.9305 5.4554L14.3117 3.92661C14.2188 3.69734 14.1834 3.6077 11.9375 3.66909L11.4486 3.16384C11.499 2.4196 11.4734 1.67215 11.372 0.933129L11.3089 0.790246L9.69323 0.0839801C9.45527 -0.0246762 9.3716 -0.0637925 7.84607 1.59756L7.16045 1.58724C5.58982 -0.0893267 5.51539 -0.058903 5.28015 0.0361713L3.77798 0.64356C3.54274 0.738634 3.45962 0.772318 3.55089 3.0541L3.06574 3.53762C0.8046 3.46373 0.76983 3.54414 0.671496 3.77558L0.0488954 5.28916L0 5.43422L0.0510685 5.56026C0.0776893 5.62545 0.156465 5.82103 1.57226 7.16946V7.87572C-0.0575877 9.4458 -0.0222745 9.52621 0.0711699 9.75656L0.689424 11.287C0.783955 11.5211 0.817639 11.6043 3.06302 11.5456L3.55197 12.0536C3.50129 12.7966 3.52623 13.543 3.6264 14.281L3.68942 14.425L5.31547 15.1356C5.55179 15.2345 5.63383 15.2698 7.15502 13.6144L7.84064 13.6231C9.41344 15.3018 9.49384 15.2692 9.72365 15.1763L11.2226 14.5706C11.4594 14.4766 11.542 14.4435 11.4469 12.1606V12.1606ZM5.00471 8.61621C4.81513 8.12077 4.7761 7.58037 4.89251 7.06283C5.00892 6.54528 5.27559 6.07365 5.65905 5.70709C6.04251 5.34054 6.52569 5.0954 7.04795 5.00244C7.57022 4.90947 8.10831 4.97282 8.5947 5.18453C9.0811 5.39624 9.49414 5.74689 9.78199 6.19247C10.0698 6.63805 10.2197 7.15872 10.2127 7.68915C10.2058 8.21958 10.0423 8.73614 9.74285 9.17401C9.4434 9.61189 9.02131 9.95157 8.52952 10.1504C7.85853 10.4128 7.11091 10.3987 6.45031 10.1112C5.7897 9.82363 5.26991 9.2861 5.00471 8.61621V8.61621Z" fill="currentColor"/>),
  'logout': new Icon('0 0 20 18',<path d="M11 13V14C11 14.7956 10.6839 15.5587 10.1213 16.1213C9.55871 16.6839 8.79565 17 8 17H4C3.20435 17 2.44129 16.6839 1.87868 16.1213C1.31607 15.5587 1 14.7956 1 14V4C1 3.20435 1.31607 2.44129 1.87868 1.87868C2.44129 1.31607 3.20435 1 4 1H8C8.79565 1 9.55871 1.31607 10.1213 1.87868C10.6839 2.44129 11 3.20435 11 4V5M15 13L19 9L15 13ZM19 9L15 5L19 9ZM19 9H5H19Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>),
  'gold-medal': new Icon('0 0 29 29', <g><path d="M28.8988 0.491188C28.7447 0.1885 28.4348 0 28.0941 0H19.0316C18.7397 0 18.4642 0.141375 18.2939 0.378813L9.83856 12.2072C9.59387 12.4628 9.52137 12.8379 9.65187 13.1678C9.78237 13.4959 10.0923 13.7188 10.4457 13.7388L19.182 14.21C19.2001 14.21 19.2164 14.21 19.2309 14.21C19.5227 14.21 19.7982 14.0686 19.9686 13.8312L28.8317 1.43369C29.0293 1.15638 29.0547 0.793875 28.8988 0.491188Z" fill="#1E88E5"/><path d="M0.102248 0.491187C0.256311 0.1885 0.566248 0 0.906998 0H9.9695C10.2613 0 10.5368 0.141375 10.7072 0.378813L19.1625 12.2072C19.4054 12.4628 19.4779 12.8379 19.3492 13.166C19.2187 13.4941 18.9088 13.717 18.5553 13.7369L9.81906 14.2082C9.80094 14.2082 9.78462 14.2082 9.77012 14.2082C9.47831 14.2082 9.20281 14.0668 9.03244 13.8294L0.169311 1.43188C-0.0282517 1.15638 -0.0536267 0.793875 0.102248 0.491187Z" fill="#2196F3"/><path d="M14.5 29C19.5051 29 23.5625 24.9426 23.5625 19.9375C23.5625 14.9324 19.5051 10.875 14.5 10.875C9.49492 10.875 5.4375 14.9324 5.4375 19.9375C5.4375 24.9426 9.49492 29 14.5 29Z" fill="#FFC107"/><path d="M15.4062 24.4688C14.906 24.4688 14.5 24.0627 14.5 23.5625V17.2188H13.5938C13.0935 17.2188 12.6875 16.8127 12.6875 16.3125C12.6875 15.8123 13.0935 15.4062 13.5938 15.4062H15.4062C15.9065 15.4062 16.3125 15.8123 16.3125 16.3125V23.5625C16.3125 24.0627 15.9065 24.4688 15.4062 24.4688Z" fill="#FAFAFA"/></g>),
  'silver-medal': new Icon('0 0 29 29',<g><path d="M28.8978 0.491187C28.7438 0.1885 28.4338 0 28.0931 0H19.0306C18.7388 0 18.4633 0.141375 18.2929 0.378813L9.83758 12.2072C9.5929 12.4628 9.5204 12.8379 9.6509 13.1678C9.7814 13.4959 10.0913 13.7188 10.4448 13.7387L19.181 14.21C19.1991 14.21 19.2155 14.21 19.23 14.21C19.5218 14.21 19.7973 14.0686 19.9676 13.8312L28.8308 1.43369C29.0283 1.15638 29.0537 0.793875 28.8978 0.491187Z" fill="#1E88E5"/><path d="M0.103225 0.491187C0.257287 0.1885 0.567225 0 0.907975 0H9.97047C10.2623 0 10.5378 0.141375 10.7082 0.378813L19.1635 12.2072C19.4063 12.4628 19.4788 12.8379 19.3502 13.166C19.2197 13.4941 18.9097 13.717 18.5563 13.7369L9.82004 14.2082C9.80191 14.2082 9.7856 14.2082 9.7711 14.2082C9.47929 14.2082 9.20379 14.0668 9.03341 13.8294L0.170287 1.43188C-0.0272751 1.15638 -0.0526501 0.793875 0.103225 0.491187Z" fill="#2196F3"/><path d="M14.5 29C19.5051 29 23.5625 24.9426 23.5625 19.9375C23.5625 14.9324 19.5051 10.875 14.5 10.875C9.49492 10.875 5.4375 14.9324 5.4375 19.9375C5.4375 24.9426 9.49492 29 14.5 29Z" fill="#CFD8DC"/><path d="M16.3125 24.4688H12.6875C12.1873 24.4688 11.7812 24.0627 11.7812 23.5625V21.75C11.7812 20.2511 13.0011 19.0312 14.5 19.0312C15.0002 19.0312 15.4062 18.6234 15.4062 18.125C15.4062 17.6266 15.0002 17.2188 14.5 17.2188H12.6875C12.1873 17.2188 11.7812 16.8127 11.7812 16.3125C11.7812 15.8123 12.1873 15.4062 12.6875 15.4062H14.5C15.9989 15.4062 17.2188 16.6261 17.2188 18.125C17.2188 19.6239 15.9989 20.8438 14.5 20.8438C13.9998 20.8438 13.5938 21.2516 13.5938 21.75V22.6562H16.3125C16.8127 22.6562 17.2188 23.0623 17.2188 23.5625C17.2188 24.0627 16.8127 24.4688 16.3125 24.4688Z" fill="#FAFAFA"/></g>),
  'bronze-medal': new Icon('0 0 29 29', <><g clipPath="url(#clip0)"><path d="M28.8988 0.491187C28.7447 0.1885 28.4348 0 28.0941 0H19.0316C18.7397 0 18.4642 0.141375 18.2939 0.378813L9.83856 12.2072C9.59387 12.4628 9.52137 12.8379 9.65187 13.1678C9.78237 13.4959 10.0923 13.7188 10.4457 13.7387L19.182 14.21C19.2001 14.21 19.2164 14.21 19.2309 14.21C19.5227 14.21 19.7982 14.0686 19.9686 13.8312L28.8317 1.43369C29.0293 1.15638 29.0547 0.793875 28.8988 0.491187Z" fill="#1E88E5"/><path d="M0.103225 0.491187C0.257287 0.1885 0.567225 0 0.907974 0H9.97047C10.2623 0 10.5378 0.141375 10.7082 0.378813L19.1635 12.2072C19.4063 12.4628 19.4788 12.8379 19.3501 13.166C19.2196 13.4941 18.9097 13.717 18.5563 13.7369L9.82003 14.2082C9.80191 14.2082 9.78559 14.2082 9.77109 14.2082C9.47928 14.2082 9.20378 14.0668 9.03341 13.8294L0.170287 1.43188C-0.0272751 1.15638 -0.0526501 0.793875 0.103225 0.491187Z" fill="#2196F3"/><path d="M14.5 29C19.5051 29 23.5625 24.9426 23.5625 19.9375C23.5625 14.9324 19.5051 10.875 14.5 10.875C9.49492 10.875 5.4375 14.9324 5.4375 19.9375C5.4375 24.9426 9.49492 29 14.5 29Z" fill="#8D6E63"/><path d="M17.2188 18.125C17.2188 16.6261 15.9989 15.4062 14.5 15.4062H12.6875C12.1873 15.4062 11.7812 15.8123 11.7812 16.3125C11.7812 16.8127 12.1873 17.2188 12.6875 17.2188H14.5C15.0002 17.2188 15.4062 17.6266 15.4062 18.125C15.4062 18.6234 15.0002 19.0312 14.5 19.0312H12.6875C12.1873 19.0312 11.7812 19.4373 11.7812 19.9375C11.7812 20.4377 12.1873 20.8438 12.6875 20.8438H14.5C15.0002 20.8438 15.4062 21.2516 15.4062 21.75C15.4062 22.2484 15.0002 22.6562 14.5 22.6562H12.6875C12.1873 22.6562 11.7812 23.0623 11.7812 23.5625C11.7812 24.0627 12.1873 24.4688 12.6875 24.4688H14.5C15.9989 24.4688 17.2188 23.2489 17.2188 21.75C17.2188 21.0504 16.9469 20.4196 16.5119 19.9375C16.9469 19.4554 17.2188 18.8246 17.2188 18.125Z" fill="#FAFAFA"/></g><defs><clipPath id="clip0"><rect width="29" height="29" fill="white"/></clipPath></defs> </>),
  'workshop': new Icon('0 0 30 38',<g><path d="M4.70997 34.7419V28.0329C4.70997 27.2968 3.59668 27.2959 3.59668 28.0329V34.7419C3.59668 35.4777 4.70997 35.4788 4.70997 34.7419Z" fill="#4D4D4F"/><path d="M22.9736 9.95464V28.0455C22.9736 28.7813 24.0869 28.7825 24.0869 28.0455V9.95464C24.0869 9.21883 22.9736 9.21767 22.9736 9.95464Z" fill="#4D4D4F"/><path d="M6.98209 20.4688H6.05813V7.68689L6.83076 5.51366C6.86497 5.41799 6.87222 5.31478 6.85163 5.21534L5.93955 0.77988C5.84678 0.328187 5.44437 0 4.98311 0H3.32014C2.85888 0 2.45648 0.328187 2.3637 0.77988L1.45162 5.21534C1.43104 5.31478 1.43828 5.41799 1.47249 5.51366L2.24512 7.68689V20.4688H1.32116C0.592592 20.4688 0 21.0614 0 21.79V22.3852C0 23.1137 0.592592 23.7063 1.32116 23.7063H1.60557C1.54468 24.1977 1.39769 24.6787 1.17185 25.1197C0.786837 25.8711 0.583605 26.7148 0.583605 27.5593V30.1384C0.583605 30.8743 1.6966 30.8754 1.6966 30.1384V27.5593C1.6966 26.8905 1.85779 26.2222 2.16279 25.627C2.46865 25.0295 2.66 24.374 2.72552 23.706H5.57773C5.64325 24.374 5.8346 25.0295 6.14046 25.627C6.44546 26.2222 6.60665 26.8905 6.60665 27.559V35.6266C6.60665 36.3215 6.04131 36.8869 5.34638 36.8869H2.95687C2.26194 36.8869 1.6966 36.3215 1.6966 35.6266V32.3647C1.6966 31.6286 0.583605 31.6277 0.583605 32.3647V35.6266C0.583605 36.9353 1.64818 37.9999 2.95687 37.9999H5.34638C6.65507 37.9999 7.71965 36.9353 7.71965 35.6266V27.5593C7.71965 26.7148 7.51641 25.8711 7.1314 25.1197C6.90556 24.6787 6.75857 24.1977 6.69769 23.7063H6.98209C7.71066 23.7063 8.30325 23.1137 8.30325 22.3852V21.79C8.30325 21.0614 7.71066 20.4688 6.98209 20.4688V20.4688ZM3.43147 1.11329H4.87178L5.72994 5.28724L5.10835 7.03515H3.1949L2.57331 5.28724L3.43147 1.11329ZM3.35841 8.14815H4.94484V20.4688H3.35841V8.14815ZM7.19026 22.3852C7.19026 22.4997 7.0969 22.593 6.98209 22.593H1.32116C1.20635 22.593 1.113 22.4997 1.113 22.3852V21.79C1.113 21.6751 1.20635 21.5818 1.32116 21.5818H6.98209C7.0969 21.5818 7.19026 21.6751 7.19026 21.79V22.3852Z" fill="#4D4D4F"/><path d="M26.1137 24.0345V20.0762C26.1137 19.7686 25.8646 19.5196 25.557 19.5196C25.2497 19.5196 25.0007 19.7689 25.0007 20.0762V24.0345C25.0007 26.0076 25.7168 27.8953 27.0168 29.3498C27.783 30.2068 28.2048 31.3126 28.2048 32.4632C28.2048 34.0937 27.3661 35.5862 25.9942 36.4366V32.937C25.9942 32.129 25.3367 31.4714 24.5287 31.4714H22.5326C21.7243 31.4714 21.0671 32.129 21.0671 32.937V36.4366C19.6952 35.5862 18.8564 34.0937 18.8564 32.4632C18.8564 31.3126 19.2783 30.2068 20.0445 29.3498C21.3445 27.8953 22.0606 26.0076 22.0606 24.0345V13.9656C22.0606 11.9924 21.3445 10.1048 20.0445 8.65024C19.2783 7.79324 18.8564 6.68749 18.8564 5.53681C18.8564 3.90631 19.6952 2.41381 21.0671 1.56348V5.06308C21.0671 5.87108 21.7243 6.52862 22.5326 6.52862H24.5287C25.3367 6.52862 25.9942 5.87108 25.9942 5.06308V1.56348C27.3661 2.41381 28.2048 3.90631 28.2048 5.53681C28.2048 6.68749 27.783 7.79324 27.0168 8.65024C25.7168 10.1048 25.0007 11.9924 25.0007 13.9656V17.9239C25.0007 18.2315 25.2497 18.4805 25.557 18.4805C25.8646 18.4805 26.1137 18.2312 26.1137 17.9239V13.9656C26.1137 12.2664 26.7292 10.6423 27.8468 9.39214C28.7954 8.33075 29.3178 6.96175 29.3178 5.53681C29.3178 3.3746 28.1266 1.40837 26.2091 0.405545C25.6049 0.0898246 24.8809 0.527021 24.8809 1.20862V5.06308C24.8809 5.25733 24.7229 5.41562 24.5287 5.41562H22.5326C22.3384 5.41562 22.1801 5.25733 22.1801 5.06308V1.20862C22.1801 0.527311 21.4567 0.0892447 20.852 0.405545C18.9344 1.40837 17.7432 3.3746 17.7432 5.53681C17.7432 6.96175 18.2656 8.33075 19.2142 9.39214C20.3318 10.6423 20.9473 12.2664 20.9473 13.9656V24.0345C20.9473 25.7337 20.3318 27.3578 19.2142 28.6079C18.2656 29.6693 17.7432 31.0383 17.7432 32.4632C17.7432 34.6255 18.9344 36.5917 20.852 37.5945C21.1358 37.7429 21.4689 37.7328 21.7432 37.5667C22.0168 37.4011 22.1801 37.1112 22.1801 36.7914V32.937C22.1801 32.7427 22.3384 32.5847 22.5326 32.5847H24.5287C24.7229 32.5847 24.8809 32.7427 24.8809 32.937V36.7914C24.8809 37.473 25.6046 37.9105 26.2091 37.5945C28.1266 36.5917 29.3181 34.6255 29.3181 32.4632C29.3181 31.0383 28.7954 29.6693 27.8468 28.6079C26.7292 27.3578 26.1137 25.7337 26.1137 24.0345V24.0345Z" fill="#4D4D4F"/></g>),
  // Muy importante agregar un valor por default que regrese null
	// para evitar problemas por si llegamos a escribir mal el nombre de un ícono
	'default': null
}

export default svgs