class Solution {
public:
    long long sumAndMultiply(int n) {
        vector<int> digits;
        while(n>0){
            int temp= n%10;
            if(temp!=0){
                digits.push_back(temp);
            }
            n /=10;
        }
        if(digits.empty()){
            return 0;
        }
        reverse(digits.begin(), digits.end());

        long long x=0;
        long long sum=0;
        for(int digit : digits){
            x=x*10+digit;
            sum+=digit;
        }
        return x*sum;
    }
};