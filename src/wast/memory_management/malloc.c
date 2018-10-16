#include <stdio.h>
#include <stdlib.h>
typedef struct TRIAL {
	int a;

}TRIAL;
int main(){
	printf("Hello World\n");
	TRIAL *a = malloc(sizeof(TRIAL));
	a->a = 4;

	printf("VALUE OF TRIAL: %d\n", a->a);
	return 0;
}
