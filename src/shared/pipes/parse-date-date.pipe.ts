import { Injectable, PipeTransform } from '@nestjs/common';

Injectable();
export class ParseDatePipe implements PipeTransform {
  transform(field: string): any {
    const date = new Date(field);

    if (!date) return field;

    return date;
  }
}
