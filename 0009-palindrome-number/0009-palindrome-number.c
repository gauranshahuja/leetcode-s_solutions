bool isPalindrome(int x){
    long int org=x,rev=0;
while(x!=0){
      rev=rev*10+x%10;
      x=x/10; 
 }
if(org == rev && rev>=0)
return true;
else
return false;
}