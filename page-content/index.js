function createViewModel() {
    var vm = new ViewModel();
    vm.employees.push(new Employee("Moon", "Sun", "Outdoors, Inc.", "Mountain Climber", 12000.50, 1820.888, 30));
    vm.employees.push(new Employee("Len", "Zhao", "Big Compnay", ".NET Developer", 8028.99, 306.8765, 10));
    vm.employees.push(new Employee("Andrew", "Backer", "Power E2E", "R&D Manager", 10000.7523, 500.9313, 20));
    return vm;
}

function ViewModel() {
    var self = this;
    self.employees = ko.observableArray([]);
}

function Employee(firstName, lastName, company, jobTitle, salary, tax, yearsExperience) {
    var self = this;
    self.firstName = ko.observable(firstName);
    self.lastName = ko.observable(lastName);
    self.company = company || "PowerE2E";
    self.jobTitle = jobTitle || "Unknown";
    self.salary = ko.observable(salary || 0).extend( moneyFormatExtender );
    self.tax = tax || 0;
    self.yearsExperience = yearsExperience || 0;
    self.fullName = ko.pureComputed(function() {
        return self.firstName() + " " + self.lastName();
    });
}

var moneyFormatExtender = { money : { precision: 2, symbol: '$' } };