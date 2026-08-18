import { Question } from './gameState';

export interface ProgrammingChallenge {
  id: string;
  title: string;
  description: string;
  input: string;
  expectedOutput: string;
  placeholder: string;
}

export const MCQ_POOL: Question[] = [
  // ── 8 x CS FUNDAMENTALS (CSF-01 to CSF-08) ──
  {
    id: 'CSF-01',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'EASY',
    title: 'Memory Fragmentation',
    question: 'Which memory allocation scheme is prone to external fragmentation?',
    options: [
      'A. Paging',
      'B. Segmentation',
      'C. Virtual Memory',
      'D. Cache Paging'
    ],
    correctAnswer: 1,
    explanation: 'Segmentation maps variable-sized blocks to memory, which leads to external fragmentation as segments are allocated and freed over time.'
  },
  {
    id: 'CSF-02',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'MEDIUM',
    title: 'BST Search Complexity',
    question: 'What is the worst-case time complexity of searching for an element in a binary search tree (BST)?',
    options: [
      'A. O(1)',
      'B. O(log n)',
      'C. O(n)',
      'D. O(n log n)'
    ],
    correctAnswer: 2,
    explanation: 'In the worst case, a BST can become skewed (like a linked list), making search complexity linear: O(n).'
  },
  {
    id: 'CSF-03',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'EASY',
    title: 'OOP Principles',
    question: 'Which object-oriented programming concept refers to the ability of different classes to respond to the same message in different ways?',
    options: [
      'A. Inheritance',
      'B. Encapsulation',
      'C. Polymorphism',
      'D. Abstraction'
    ],
    correctAnswer: 2,
    explanation: 'Polymorphism allows objects of different classes to define their own implementations of methods with the same signature.'
  },
  {
    id: 'CSF-04',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'MEDIUM',
    title: 'Sorting Algorithms',
    question: 'Which of the following sorting algorithms has a guaranteed worst-case time complexity of O(n log n)?',
    options: [
      'A. Quick Sort',
      'B. Bubble Sort',
      'C. Insertion Sort',
      'D. Merge Sort'
    ],
    correctAnswer: 3,
    explanation: 'Merge Sort uses a divide-and-conquer strategy that performs in O(n log n) time in the worst, best, and average cases.'
  },
  {
    id: 'CSF-05',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'MEDIUM',
    title: 'Queue Condition',
    question: 'In a circular queue implemented using an array of size N, what is the mathematical condition for the queue being full?',
    options: [
      'A. (rear + 1) % N == front',
      'B. rear == front',
      'C. rear + 1 == front',
      'D. front == 0'
    ],
    correctAnswer: 0,
    explanation: 'A circular queue is considered full when the next position of rear wraps around to match the front index.'
  },
  {
    id: 'CSF-06',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'EASY',
    title: 'CPU Scheduling Starvation',
    question: 'Which CPU scheduling algorithm can lead to starvation of longer processes?',
    options: [
      'A. Round Robin',
      'B. Shortest Job First (SJF)',
      'C. First-Come First-Served (FCFS)',
      'D. First-In First-Out (FIFO)'
    ],
    correctAnswer: 1,
    explanation: 'Shortest Job First (SJF) always prioritizes shorter jobs, which can starve longer processes if there is a constant stream of short tasks.'
  },
  {
    id: 'CSF-07',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'EASY',
    title: 'Recursion Data Structure',
    question: 'What data structure is implicitly used by compilers to implement recursion in high-level programming languages?',
    options: [
      'A. Queue',
      'B. Stack',
      'C. Heap',
      'D. Tree'
    ],
    correctAnswer: 1,
    explanation: 'The call stack is used by compilers to store execution contexts, return addresses, and local variables for recursive function invocations.'
  },
  {
    id: 'CSF-08',
    category: 'CS_FUNDAMENTALS',
    difficulty: 'MEDIUM',
    title: 'Dangling Pointers',
    question: 'What is a dangling pointer?',
    options: [
      'A. A pointer pointing to a null address',
      'B. A pointer pointing to a deallocated/freed memory location',
      'C. A pointer that has not been initialized',
      'D. A pointer pointing to global memory'
    ],
    correctAnswer: 1,
    explanation: 'A dangling pointer points to memory that has already been deallocated, which can cause undefined behavior or crashes if dereferenced.'
  },

  // ── 6 x DBMS (DB-01 to DB-06) ──
  {
    id: 'DB-01',
    category: 'DBMS',
    difficulty: 'MEDIUM',
    title: 'Database Normalization',
    question: 'Which normal form is specifically designed to handle multi-valued dependencies?',
    options: [
      'A. 1NF',
      'B. 2NF',
      'C. 3NF',
      'D. 4NF'
    ],
    correctAnswer: 3,
    explanation: 'A table is in Fourth Normal Form (4NF) if it is in BCNF and has no multi-valued dependencies.'
  },
  {
    id: 'DB-02',
    category: 'DBMS',
    difficulty: 'EASY',
    title: 'ACID Properties',
    question: 'Which property of ACID transactions guarantees that committed changes survive system failures?',
    options: [
      'A. Atomicity',
      'B. Consistency',
      'C. Isolation',
      'D. Durability'
    ],
    correctAnswer: 3,
    explanation: 'Durability ensures that once a transaction commits, its changes are written to non-volatile storage and will not be lost.'
  },
  {
    id: 'DB-03',
    category: 'DBMS',
    difficulty: 'EASY',
    title: 'Foreign Keys',
    question: 'What is the purpose of a Foreign Key in a database schema?',
    options: [
      'A. To uniquely identify each row in a table',
      'B. To establish a link/relationship between two tables',
      'C. To speed up read queries using a hash map',
      'D. To encrypt data columns'
    ],
    correctAnswer: 1,
    explanation: 'A Foreign Key points to a Primary Key of another table, enforcing referential integrity and linking the tables.'
  },
  {
    id: 'DB-04',
    category: 'DBMS',
    difficulty: 'MEDIUM',
    title: 'Clustered Indexes',
    question: 'Which type of index physically reorders the rows of a table to match the index key order?',
    options: [
      'A. Clustered Index',
      'B. Non-clustered Index',
      'C. Hash Index',
      'D. Bitmap Index'
    ],
    correctAnswer: 0,
    explanation: 'A Clustered Index dictates the physical storage order of the rows in the table. Hence, there can be only one clustered index per table.'
  },
  {
    id: 'DB-05',
    category: 'DBMS',
    difficulty: 'MEDIUM',
    title: 'Shared Locks',
    question: 'Which lock level permits multiple transactions to read a resource simultaneously but prevents writes?',
    options: [
      'A. Exclusive Lock',
      'B. Shared Lock',
      'C. Intent Lock',
      'D. Update Lock'
    ],
    correctAnswer: 1,
    explanation: 'Shared Locks (S-locks) allow concurrent reads, whereas Exclusive Locks (X-locks) are used to lock a resource for writes, blocking others.'
  },
  {
    id: 'DB-06',
    category: 'DBMS',
    difficulty: 'EASY',
    title: 'SQL Joins',
    question: 'Which join returns all records from the left table and matched records from the right table, padding with NULLs for missing right records?',
    options: [
      'A. Inner Join',
      'B. Right Outer Join',
      'C. Left Outer Join',
      'D. Full Outer Join'
    ],
    correctAnswer: 2,
    explanation: 'A Left Outer Join returns all records from the left table, plus matching rows from the right table, using NULLs where no match exists.'
  },

  // ── 6 x COMPUTER NETWORKS (CN-01 to CN-06) ──
  {
    id: 'CN-01',
    category: 'COMPUTER_NETWORKS',
    difficulty: 'EASY',
    title: 'OSI Network Layer',
    question: 'Which OSI layer is responsible for logical addressing and packet routing across different network domains?',
    options: [
      'A. Physical Layer',
      'B. Data Link Layer',
      'C. Network Layer',
      'D. Transport Layer'
    ],
    correctAnswer: 2,
    explanation: 'The Network Layer (Layer 3) handles IP addressing, routing tables, and forwarding packets between networks.'
  },
  {
    id: 'CN-02',
    category: 'EASY',
    title: 'HTTPS Port',
    question: 'What default port number is used by secure HTTP connections (HTTPS)?',
    options: [
      'A. Port 80',
      'B. Port 443',
      'C. Port 22',
      'D. Port 8080'
    ],
    correctAnswer: 1,
    explanation: 'HTTPS traffic is typically directed to Port 443, whereas unsecure HTTP uses Port 80.'
  },
  {
    id: 'CN-03',
    category: 'COMPUTER_NETWORKS',
    difficulty: 'EASY',
    title: 'UDP Characteristics',
    question: 'Which of the following is a primary characteristic of User Datagram Protocol (UDP)?',
    options: [
      'A. Connection-oriented stream transmission',
      'B. Guaranteed delivery with packet acknowledgment',
      'C. Built-in congestion control',
      'D. Connectionless and low-overhead transmission'
    ],
    correctAnswer: 3,
    explanation: 'UDP is a connectionless, best-effort protocol that trades reliability and ordering for speed and low overhead.'
  },
  {
    id: 'CN-04',
    category: 'COMPUTER_NETWORKS',
    difficulty: 'EASY',
    title: 'IPv6 Address Size',
    question: 'What is the standard address space size of an IPv6 address?',
    options: [
      'A. 32 bits',
      'B. 64 bits',
      'C. 128 bits',
      'D. 256 bits'
    ],
    correctAnswer: 2,
    explanation: 'IPv6 uses 128-bit addresses, permitting a massively larger address space compared to IPv4\'s 32-bit limit.'
  },
  {
    id: 'CN-05',
    category: 'COMPUTER_NETWORKS',
    difficulty: 'MEDIUM',
    title: 'DNS A Record',
    question: 'Which DNS resource record type maps a domain name to an IPv4 host address?',
    options: [
      'A. A Record',
      'B. AAAA Record',
      'C. MX Record',
      'D. CNAME Record'
    ],
    correctAnswer: 0,
    explanation: 'The "A" (Address) record maps a hostname to an IPv4 address. "AAAA" maps to IPv6; "MX" points to mail servers.'
  },
  {
    id: 'CN-06',
    category: 'COMPUTER_NETWORKS',
    difficulty: 'MEDIUM',
    title: 'ARP Protocol',
    question: 'Which network protocol resolves a known IP address to its corresponding physical MAC address?',
    options: [
      'A. DHCP',
      'B. DNS',
      'C. ARP',
      'D. ICMP'
    ],
    correctAnswer: 2,
    explanation: 'ARP (Address Resolution Protocol) maps dynamic IP addresses to physical MAC addresses on a local area network segment.'
  }
];

export const CODING_CHALLENGES: ProgrammingChallenge[] = [
  {
    id: 'CODE-01',
    title: 'PROGRAMMING CHALLENGE 01',
    description: 'Find the largest element in an array. The input will contain the number of elements N on the first line, followed by N integers separated by space on the second line.',
    input: `5\n10 4 8 2 15`,
    expectedOutput: '15',
    placeholder: 'Paste your output here (e.g. 15)'
  },
  {
    id: 'CODE-02',
    title: 'PROGRAMMING CHALLENGE 02',
    description: 'Check whether a string is a palindrome. Return true if the string is identical when read forward or backward, and false otherwise. Input is a single word.',
    input: 'racecar',
    expectedOutput: 'true',
    placeholder: 'Paste your output here (e.g. true)'
  }
];
