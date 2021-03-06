#include <stdio.h>
#include <stdlib.h>
int factorial(int n){
    if(n == 0) return 1;
    return n*factorial(n-1);  
}

int main(int argc, char **argv){
    //int *ptr = (int *)malloc(sizeof(int)*10)i;
    int *ptr2 = (int *) calloc(50,4);
    int sum = 0;
    for(int j= 0;j < 50;j ++){
        ptr2[j] = 2*rand();
        sum+= ptr2[j];
    }
    int *ptr;
    for(int i = 0;i< 10;i++){
        ptr = (int *)malloc(sizeof(int)*1000000);
        ptr[i] = i+10;
        // printf("VALUE IN MEMORY: %d\n", ptr[i]);
    }    
    int b = ptr[9];
    int c = factorial(4);
    free(ptr);
    printf("sum: %d\n",sum);
    free(ptr2);
    return b + c;
}
