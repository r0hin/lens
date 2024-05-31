// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Lens {
    address public bureauAdmin = 0xfF01A49f2B81C67a50770a97F6f0d8E172a7e357;

    struct CreditReport {
        string userAccessKey;
        string vendorAccessKey;
        string score;
        address[] vendors;
        mapping(address => string[]) reports;
    }

    mapping(address => CreditReport) private userCredits;
    mapping(address => bool) private authorizedVendors;

    modifier onlyBureauAdmin() {
        require(msg.sender == bureauAdmin, "Not the bureau admin");
        _;
    }

    modifier onlyAuthorizedVendor() {
        require(authorizedVendors[msg.sender], "Not an authorized vendor");
        _;
    }

    modifier onlyUserApprovedVendor(address user) {
        require(
            userCredits[user].reports[msg.sender].length > 0,
            "Vendor not authorized"
        );
        _;
    }

    function addVendor(address vendor) external onlyBureauAdmin {
        authorizedVendors[vendor] = true;
    }

    function removeVendor(address vendor) external onlyBureauAdmin {
        authorizedVendors[vendor] = false;
    }

    function uploadCreditReport(
        address user,
        string memory encryptedData,
        string memory newScore,
        string memory userAccessKey,
        string memory vendorAccessKey
    ) external onlyAuthorizedVendor onlyUserApprovedVendor(user) {
        CreditReport storage creditReport = userCredits[user];
        // Add the vendor to the list if it's the first report from this vendor
        if (creditReport.reports[msg.sender].length == 0) {
            creditReport.userAccessKey = userAccessKey;
            creditReport.vendorAccessKey = vendorAccessKey;
            creditReport.vendors.push(msg.sender);
        }

        creditReport.reports[msg.sender].push(encryptedData);

        // Update the credit score encrypted
        creditReport.score = newScore;
    }

    function allowVendorAccess(address vendor) external {
        address user = msg.sender;
        CreditReport storage creditReport = userCredits[user];
        creditReport.vendors.push(vendor);
        creditReport.reports[vendor].push("$");
    }

    function getAlgorithm() external pure returns (string memory) {
        // Referencing vantage 3.0
        return "{ph: 41, cur: 20, dm: 8, cav: 20, ta: 11}";
    }

    function getUserAccessKey() external view returns (string memory) {
        address user = msg.sender;
        return userCredits[user].userAccessKey;
    }

    function getVendorAccessKey(
        address user
    ) external view returns (string memory) {
        return userCredits[user].vendorAccessKey;
    }

    function getCreditScore(
        address user
    ) external view returns (string memory) {
        // returns encrypted credit score
        return userCredits[user].score;
    }

    function retrieveCreditReports() external view returns (string memory) {
        address user = msg.sender;
        CreditReport storage creditReport = userCredits[user];
        string memory result = "";

        for (uint i = 0; i < creditReport.vendors.length; i++) {
            address vendor = creditReport.vendors[i];
            string[] storage reports = creditReport.reports[vendor];

            for (uint j = 0; j < reports.length; j++) {
                result = string(abi.encodePacked(result, reports[j], "$"));
            }
        }

        return result;
    }
}
