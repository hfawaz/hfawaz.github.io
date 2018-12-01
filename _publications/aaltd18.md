---
title: "Data augmentation using synthetic data for time series classification with deep residual networks"
collection: publications
permalink: /publication/aaltd18
excerpt: 'Our preliminary experiments reveal that data augmentation can drastically increase deep CNN's accuracy on some datasets and significantly improve the deep model's accuracy when the method is used in an ensemble approach'
date: 2018-09-14
venue: 'Medical Image Computing and Computer Assisted Intervention'
paperurl: 'https://project.inria.fr/aaldt18/files/2018/08/aaltd18_data_aug.pdf'
citation: 'Ismail Fawaz, H., Forestier, G., Weber, J., Idoumghar, L., & Muller, P. A. (2018). Evaluating surgical skills from kinematic data using convolutional neural networks. <i>Medical Image Computing and Computer Assisted Intervention</i>'
---
The need for automatic surgical skills assessment is increasing, especially because manual feedback from senior surgeons observing junior surgeons is prone to subjectivity and time consuming. Thus, automating surgical skills evaluation is a very important step towards improving surgical practice. In this paper, we designed a Convolutional Neural Network (CNN) to evaluate surgeon skills by extracting patterns in the surgeon motions performed in robotic surgery. The proposed method is validated on the JIGSAWS dataset and achieved very competitive results with 100% accuracy on the suturing and needle passing tasks. While we leveraged from the CNNs efficiency, we also managed to mitigate its black-box effect using class activation map. This feature allows our method to automatically highlight which parts of the surgical task influenced the skill prediction and can be used to explain the classification and to provide personalized feedback to the trainee. 

[Download paper here](https://arxiv.org/abs/1806.02750)

[Code is available here](https://github.com/hfawaz/aaltd18)

Bibtex:
```
@InProceedings{IsmailFawaz2018evaluating,
  Title                    = {Evaluating surgical skills from kinematic data using convolutional neural networks},
  Author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Idoumghar, Lhassane and Muller, Pierre-Alain},
  booktitle                = {International Conference On Medical Image Computing and Computer Assisted Intervention (MICCAI)},
  Year                     = {2018},
  pages = {214--221}
}
```