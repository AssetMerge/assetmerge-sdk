"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const index_1 = require("./index");
const provider = ethers_1.providers.getDefaultProvider();
(0, index_1.fetchERC721)('0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258', provider).then(token => {
    new index_1.BalanceManager(token, '0x83c8f28c26bf6aaca652df1dbbe0e1b56f8baba2', provider);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsbUNBQWtDO0FBQ2xDLG1DQUFxRDtBQUVyRCxNQUFNLFFBQVEsR0FBRyxrQkFBUyxDQUFDLGtCQUFrQixFQUFFLENBQUE7QUFFL0MsSUFBQSxtQkFBVyxFQUFDLDRDQUE0QyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUMvRSxJQUFJLHNCQUFjLENBQUMsS0FBSyxFQUFFLDRDQUE0QyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ25GLENBQUMsQ0FBQyxDQUFBIn0=