class Person {
    #ID;
    #email;

    constructor(ID, name, email) {
        this.ID = ID;
        this.name = name;
        this.email = email;
    }

    get ID() {
        return this.#ID;
    }

    set ID(value) {
        if (typeof value === 'number' && value > 0) {
            this.#ID = value;
        } else {
            throw new Error('ID must be a positive number');
        }
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(value)) {
            this.#email = value;
        } else {
            throw new Error('Invalid email format');
        }
    }

    playRole() {
        return `Person ${this.name} is playing a role.`;
    }
}

class Principal extends Person {
    static #members = [];
    constructor(ID, name, email) {
        super(ID, name, email);
        if (!Principal.#members.some(m => m.ID === ID)) {
            Principal.#members.push(this);
        }
    }

    static getStudent(name) {
        const student = Principal.#members.find(m => m.name === name && m instanceof Student);
        if (!student) {
            return null;
        }
        return student;
    }

    addMembers(members) {
        for (const member of members) {            
            if (!(member instanceof Person)) {
                throw new Error('Member must be an instance of Person');
            }
            Principal.#members.push(member);
        }
    }

    removeMembers(members) {
        for (const member of members) {
            const index = Principal.#members.indexOf(member);
            if (index > -1) {
                Principal.#members.splice(index, 1);
            }
        }
    }

    static listMembers() {
        if (Principal.#members.length === 0) {
            return 'No members found.';
        }

        for (const member of Principal.#members) {
            if (member instanceof Person) {
                return Principal.#members.map(m => m.name).join(', ');
            }
        }
    }

    get members() {
        return Principal.#members;
    }

    playRole() {
        return `Principal ${this.name} is playing a role.`;
    }
}

class Subject {
    static subjects = ["Math", "Science", "History", "English"];
    constructor(name) {
        this.name = name;
        if (!Subject.subjects.includes(name)) {
            Subject.subjects.push(name);
        }
    }
}

class Teacher extends Person {
    #subject;
    #studentGrades;

    constructor(ID, name, email, subject) {
        super(ID, name, email);
        this.subject = subject;
        this.#studentGrades = [];
    }

    get subject() {
        return this.#subject;
    }

    set subject(value) {
        if (Subject.subjects.includes(value)) {
            this.#subject = value;
        } else {
            throw new Error('Invalid subject');
        }
    }

    showStudentGrades() {
        console.log(`-----Grades for ${this.subject}-----`);
        for (const [student, grade] of this.#studentGrades) {
            console.log(`Student: ${student.name}, Grade: ${grade}`);
        }
    }

    #addStudentGrade(studentName, grade) {
        const student = Principal.getStudent(studentName);
        if (!student) {
            throw new Error('Invalid student');
        }
        if (typeof grade !== 'number' || grade < 0 || grade > 100) {
            throw new Error('Invalid grade');
        }
        this.#studentGrades.push([student, grade]);
    }

    gradeStudent(studentName, grade) {
        const student = Principal.getStudent(studentName);
        if (!student) {
            throw new Error('Invalid student');
        }
        if (typeof grade !== 'number' || grade < 0 || grade > 100) {
            throw new Error('Invalid grade');
        }
        student.addGrade(this.subject, grade);
        this.#addStudentGrade(studentName, grade);
    }

    playRole() {
        return `Teacher ${this.name} is teaching ${this.subject}.`;
    }
}

class Student extends Person {
    #enrolledSubjects = {};

    constructor(ID, name, email) {
        super(ID, name, email);
    }

    enrollSubject(subject) {
        if (!Subject.subjects.includes(subject)) {
            throw new Error('Invalid subject');
        }
        this.#enrolledSubjects[subject] = 0;
    }

    addGrade(subject, grade) {
        if (!this.#enrolledSubjects.hasOwnProperty(subject)) {
            throw new Error('Student is not enrolled in this subject');
        }
        if (typeof grade !== 'number' || grade < 0 || grade > 100) {
            throw new Error('Invalid grade');
        }
        this.#enrolledSubjects[subject] = grade;
    }

    getGrade(subject) {
        if (!this.#enrolledSubjects.hasOwnProperty(subject)) {
            throw new Error('Student is not enrolled in this subject');
        }
        return this.#enrolledSubjects[subject];
    }

    get enrolledSubjects() {
        return Object.keys(this.#enrolledSubjects);
    }

    playRole() {
        return `Student ${this.name} is studying.`;
    }
}

function main() {
    const principal = new Principal(1, 'Alice', 'alice@example.com');
    const teacher = new Teacher(2, 'Bob', 'bob@example.com', 'Math');
    const student = new Student(3, 'Charlie', 'charlie@example.com');

    principal.addMembers([teacher, student]);
    console.log(`Principal.listMembers(): ${Principal.listMembers()}\n`);

    student.enrollSubject('Math');
    console.log(`Charlie's enrolled subjects: ${student.enrolledSubjects.join(', ')}\n`);
    teacher.gradeStudent('Charlie', 90);
    console.log(`Charlie's ${teacher.subject} grade: ${student.getGrade(teacher.subject)}\n`);
    teacher.showStudentGrades();
    console.log("\n");
    for (const member of principal.members) {
        console.log(member.playRole());
    }
}

main();